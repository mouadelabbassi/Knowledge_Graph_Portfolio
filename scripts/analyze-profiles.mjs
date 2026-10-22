import { readFile, writeFile } from 'node:fs/promises';

const labels = ['baseline-1x','baseline-4x','fixed-1x','fixed-4x','m2-4x'];
const reports = [];
for (const label of labels) {
  try {
    const measured = JSON.parse(await readFile(`docs/performance/${label}-measured.json`, 'utf8'));
    const lhr = JSON.parse(await readFile(`docs/performance/${label}-lighthouse.json`, 'utf8'));
    const trace = JSON.parse(await readFile(`docs/performance/${label}-lighthouse-0.trace.json`, 'utf8'));
    const start = trace.traceEvents.find(event => event.name === 'portfolio:profile:start');
    const end = trace.traceEvents.find(event => event.name === 'portfolio:profile:end');
    const tasks = {};
    if (start && end) for (const event of trace.traceEvents) {
      if (event.pid !== start.pid || event.tid !== start.tid || event.ts < start.ts || event.ts > end.ts || event.ph !== 'X') continue;
      if (!['RunTask','ThreadControllerImpl::RunTask','UpdateLayoutTree','Layout','Paint','FireAnimationFrame'].includes(event.name)) continue;
      const values = tasks[event.name] ??= [];
      values.push((event.dur ?? 0) / 1000);
    }
    const traceTasks = Object.fromEntries(Object.entries(tasks).map(([name, values]) => {
      const sorted = [...values].sort((a,b)=>a-b);
      return [name,{ count: values.length,totalMs:values.reduce((a,b)=>a+b,0),p95Ms:sorted[Math.floor(sorted.length*.95)]??0,maxMs:sorted.at(-1)??0 }];
    }));
    reports.push({ label, ...measured, verifiedCpuMultiplier: lhr.configSettings.throttling.cpuSlowdownMultiplier, throttlingMethod: lhr.configSettings.throttlingMethod, lighthouseVersion:lhr.lighthouseVersion, loadAuditError:lhr.runtimeError?.code??null, completeProfileTrace:Boolean(start&&end), traceTasks });
  } catch(error) { if (label !== 'm2-4x') throw error; }
}
await writeFile('docs/performance/summary.json',JSON.stringify(reports,null,2));
for(const report of reports) console.log(JSON.stringify({label:report.label,cpu:report.verifiedCpuMultiplier,fps:+report.fps.toFixed(2),renderP95:report.work.render.p95Ms,projectionP95:report.work.projection.p95Ms,styleWrites:report.styleWrites,layoutRuns:report.layout.runs,idleFrames:report.idleFrames,trace:report.completeProfileTrace,loadAuditError:report.loadAuditError}));
