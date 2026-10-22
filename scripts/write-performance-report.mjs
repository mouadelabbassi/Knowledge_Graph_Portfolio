import { readFile, writeFile } from 'node:fs/promises';
const reports=JSON.parse(await readFile('docs/performance/summary.json','utf8'));
const fixed=reports.find(report=>report.label==='fixed-4x');
const m2=reports.find(report=>report.label==='m2-4x');
const rows=reports.map(report=>`| ${report.label} | ${report.fps.toFixed(2)} | ${report.calls}${report.peakCalls ? ' / '+report.peakCalls : ''} | ${report.work.render.p95Ms.toFixed(2)} | ${report.work.projection.p95Ms.toFixed(2)} | ${report.styleWrites} | ${report.layout.runs} | ${report.idleFrames??'not sampled'} |`).join('\n');
await writeFile('docs/performance/REPORT.md',`# Profiling fix and Milestone 2 performance

The historical ~17 FPS result was not reproduced as a sustained rendering limit in controlled runs. The saved historical sample counted 725 renders across 42.52 seconds and reported browser animation-frame cadence of 1.96 FPS at capture. That cumulative result mixed changing browser cadence; no trace was recorded for it, so a specific OS/browser scheduling cause cannot be proved retrospectively.

The new measurements use a fixed 12-second active interval, a separate idle check, and a saved Chrome trace containing portfolio:profile:start and portfolio:profile:end marks. They count actual WebGL render calls, not Lighthouse's simulated performance score or physical display scanout.

## Controlled results

Windows, Intel Core i5-1135G7, Intel Iris Xe, Chrome via Lighthouse 13.5.0. Actual app viewport 390 × 844; actual DPR 1. CPU multipliers are verified from Lighthouse's saved configuration with throttlingMethod=devtools, which applies CPU slowdown during execution. Network throttling is disabled. Desktop GPU; this is not a physical-phone benchmark.

CPU times below are milliseconds. Render CPU measures command submission, not GPU completion. Calls are last / peak when recorded.

| Run | Render FPS | Draw calls | Render CPU p95 | Label CPU p95 | Style writes | Layout creations | Idle renders / 2 s |
|---|---:|---:|---:|---:|---:|---:|---:|
${rows}

The simple graph after the fix reached **${fixed.fps.toFixed(2)} render FPS at 4× CPU**, then **${fixed.idleFrames} idle renders** and **${fixed.idleStyleWrites} idle style writes**. The full M2 RAG query/replay workload reached **${m2.fps.toFixed(2)} render FPS at 4× CPU**, peaking at **${m2.peakCalls} draw calls**, then returned to **${m2.idleFrames} idle renders**.

## Checks and causes

- **Force simulation:** the original timer was already stopped; it was not ticking every frame. Profiling did expose 12 initial layout creations in the throttled baseline. The settled layout is now cached outside React render retries/remounts. It manually converges to alpha ≤ 0.001 (300 ticks in these runs), calls stop again, and stays unchanged. The latest M2 run created it once.
- **React:** the static baseline recorded zero GraphShell/KnowledgeGraph/GraphLabels/GraphCamera renders during the active interval. Therefore per-frame React rendering did not explain the old ~17 number. Camera changes are imperative GSAP updates; typed input stays in the Ask leaf. Debug publication also stays in its own leaf.
- **Render loop:** the original unpaused canvas used frameloop=always with a perpetual shader pulse. The canvas now always uses frameloop=demand; only finite intro, camera, reasoning replay, or explicit debug profiling schedules frames. The profile's active loop is deliberate test load and ends automatically.
- **HTML overlays:** the original projected all six labels and reassigned transform/visibility every rendered frame (8,604 writes over the 4× baseline). Projection now checks camera, projection matrix, viewport, and label registry changes, then writes only changed values. Hidden labels in the compact phone map are skipped. Necessary camera/replay label movement is counted separately in the M2 run.
- **DPR:** phone DPR is clamped to 1 on every responsive render, not only at initial state creation. Desktop is capped at 1.5.
- **Postprocessing:** zero WebGL postprocessing passes are mounted. It was not causing the dip. Render submission p95 varies between captures; this report does not claim universal improvement in GPU time.
- **Measurement:** the old cumulative FPS UI has been replaced by a rolling debug readout that explicitly reports IDLE instead of treating intentional demand-mode silence as poor FPS.

## Artifacts and audit limitation

Each run has a *-measured.json file, a *-lighthouse.json configuration/audit file, a *-lighthouse-0.trace.json Chrome trace, and a devtools log in this directory. Open the raw trace in Chrome DevTools Performance and find the portfolio:profile marks. summary.json includes selected main-thread trace event counts and timings; nested event totals must not be summed as exclusive CPU time. Large raw traces/logs remain local and are ignored by Git.

Several Windows headless captures reported NO_FCP in Lighthouse's page-load audit. The full marked runtime intervals, actual 4× configuration, and freshly collected frame counters are present and validated. **No Lighthouse score, FCP pass, physical-phone FPS, or GPU completion-time claim is made.** The actual page was separately inspected in the connected browser.

## Reproduce

1. Run npm run build.
2. Run npm run preview -- --port 4175 --strictPort in a retained terminal.
3. Open http://127.0.0.1:4175/?debug=1 for the developer overlay, or run node scripts/run-profile.mjs m2 4 for the isolated headless trace and automatic RAG/replay workload.
4. Run node scripts/analyze-profiles.mjs and node scripts/write-performance-report.mjs to regenerate the summary and this report after the needed runs exist. Baseline artifacts refer to the pre-fix code and should be retained, not regenerated using the fixed code.

Method reference: [Lighthouse CPU throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).
`);
