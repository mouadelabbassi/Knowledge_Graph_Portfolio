// Mutable, developer-only counters. Publishing happens in a separate HTML leaf;
// none of these counters send React state through the canvas tree.
export const debugEnabled = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('debug') === '1' || new URLSearchParams(window.location.search).has('diagnostics'));
const clock = () => performance.now();
type Work = 'render' | 'projection' | 'camera';
interface Frame { time: number; ms: number }
export const telemetry = {
  renders: {} as Record<string, number>,
  work: { render: [] as Frame[], projection: [] as Frame[], camera: [] as Frame[] },
  styleWrites: 0,
  frames: 0,
  calls: 0,
  peakCalls: 0,
  triangles: 0,
  dpr: 1,
  renderer: '',
  layout: { runs: 0, ticks: 0, ms: 0, alpha: 0, maxSpeed: 0, stopped: true },
  animations: new Set<string>(),
  profileDeadline: 0,
  profileResult: null as Record<string, unknown> | null,
};
export function countRender(name: string) {
  if (debugEnabled) telemetry.renders[name] = (telemetry.renders[name] ?? 0) + 1;
}
export function recordWork(name: Work, start: number) {
  if (!debugEnabled) return;
  const samples = telemetry.work[name];
  samples.push({ time: start, ms: clock() - start });
  if (samples.length > 10000) samples.splice(0, samples.length - 10000);
}
export function workSummary(values: Frame[]) {
  const sorted = values.map(value => value.ms).sort((a, b) => a - b);
  return { count: sorted.length, totalMs: sorted.reduce((a,b) => a+b,0), averageMs: sorted.reduce((a,b)=>a+b,0)/(sorted.length || 1), p95Ms: sorted[Math.floor(sorted.length * 0.95)] ?? 0, maxMs: sorted.at(-1) ?? 0 };
}
export function currentSnapshot() {
  const now = clock();
  const recent = telemetry.work.render.filter(frame => frame.time > now - 2000);
  const idle = telemetry.animations.size === 0 && (!recent.length || now - recent.at(-1)!.time > 300);
  return { fps: recent.length / 2, idle, frames: telemetry.frames, calls: telemetry.calls, triangles: telemetry.triangles, dpr: telemetry.dpr, layout: telemetry.layout, styleWrites: telemetry.styleWrites, renders: { ...telemetry.renders }, animations: [...telemetry.animations], render: workSummary(recent), projection: workSummary(telemetry.work.projection.filter(frame => frame.time > now - 2000)) };
}

export function startProfile(label = 'manual', durationMs = 12000) {
  if (telemetry.profileDeadline > clock()) return;
  const start = clock();
  const frameStart = telemetry.frames;
  const writesStart = telemetry.styleWrites;
  const renderStart = { ...telemetry.renders };
  telemetry.peakCalls = telemetry.calls;
  const browserTimes: number[] = [];
  let request = 0;
  telemetry.profileResult = null;
  telemetry.profileDeadline = start + durationMs;
  telemetry.animations.add('profile');
  performance.mark('portfolio:profile:start');
  const tick = (now: number) => { browserTimes.push(now); if (now < telemetry.profileDeadline) request = requestAnimationFrame(tick); };
  request = requestAnimationFrame(tick);
  window.dispatchEvent(new Event('portfolio:profile-start'));
  setTimeout(() => {
    cancelAnimationFrame(request);
    const end = clock();
    telemetry.profileDeadline = 0;
    telemetry.animations.delete('profile');
    const browserIntervals = browserTimes.slice(1).map((time, index) => time - browserTimes[index]!);
    const frames = telemetry.frames - frameStart;
    const work = Object.fromEntries(Object.entries(telemetry.work).map(([key, values]) => [key, workSummary(values.filter(value => value.time >= start && value.time <= end))]));
    const report = {
      label, durationMs: end - start, width: window.innerWidth, height: window.innerHeight, dpr: telemetry.dpr,
      frames, fps: frames * 1000 / (end - start), calls: telemetry.calls, peakCalls: telemetry.peakCalls, triangles: telemetry.triangles, renderer: telemetry.renderer,
      browserFrames: browserTimes.length, browserFps: browserTimes.length * 1000 / (end - start), browserIntervalP95Ms: [...browserIntervals].sort((a,b)=>a-b)[Math.floor(browserIntervals.length * .95)] ?? 0,
      work, styleWrites: telemetry.styleWrites - writesStart,
      reactRenders: Object.fromEntries(Object.entries(telemetry.renders).map(([key, value]) => [key, value - (renderStart[key] ?? 0)])),
      layout: { ...telemetry.layout }, postprocessingPasses: 0,
      visibility: document.visibilityState, focused: document.hasFocus(),
    };
    telemetry.profileResult = report;
    performance.mark('portfolio:profile:end');
    performance.measure('portfolio:profile', 'portfolio:profile:start', 'portfolio:profile:end');
    // Only the local QA preview implements this endpoint. No deployed API.
    setTimeout(() => {
      const idleFrames = telemetry.frames;
      const idleWrites = telemetry.styleWrites;
      setTimeout(() => {
        Object.assign(report, { idleCheckMs: 2000, idleFrames: telemetry.frames - idleFrames, idleStyleWrites: telemetry.styleWrites - idleWrites });
        if (new URLSearchParams(window.location.search).get('collect') === '1') void fetch('/__profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) }).catch(() => {});
      }, 2000);
    }, 500);
  }, durationMs);
}
