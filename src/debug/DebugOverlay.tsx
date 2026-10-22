import { useEffect, useState } from 'react';
import { currentSnapshot, startProfile, telemetry } from './telemetry';

export function DebugOverlay() {
  const [sample, setSample] = useState(currentSnapshot);
  useEffect(() => {
    const timer = setInterval(() => setSample(currentSnapshot()), 500);
    return () => clearInterval(timer);
  }, []);
  return <aside className="debug-overlay" aria-label="Developer performance overlay" data-fps={sample.fps.toFixed(2)} data-frames={sample.frames} data-calls={sample.calls} data-dpr={sample.dpr} data-idle={sample.idle}>
    <strong>{sample.idle ? 'IDLE · demand' : `${sample.fps.toFixed(1)} render FPS`} <span>{sample.calls} calls · DPR {sample.dpr}</span></strong>
    <span>Render CPU p95 {sample.render.p95Ms.toFixed(2)} ms · projection p95 {sample.projection.p95Ms.toFixed(2)} ms</span>
    <span>Frames {sample.frames} · style writes {sample.styleWrites} · layout ticks {sample.layout.ticks} (stopped: {String(sample.layout.stopped)})</span>
    <button onClick={() => startProfile()}>Run 12 s active profile</button>
    {telemetry.profileResult && <details><summary>Measured profile JSON</summary><pre>{JSON.stringify(telemetry.profileResult,null,2)}</pre></details>}
  </aside>;
}
