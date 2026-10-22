import { mkdir, readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const phase = process.argv[2] ?? 'fixed';
const rate = process.argv[3] ?? '4';
if (!['baseline','fixed','m2'].includes(phase) || !['1','4'].includes(rate)) throw new Error('Usage: node scripts/run-profile.mjs baseline|fixed|m2 1|4');
await mkdir('docs/performance', { recursive: true });
const label = `${phase}-${rate}x`;
const args = ['node_modules/lighthouse/cli/index.js', `http://127.0.0.1:4175/?debug=1&autoprofile=1&collect=1&profile=${label}`,
  '--config-path=scripts/lighthouse-profile.config.mjs', `--throttling.cpuSlowdownMultiplier=${rate}`,
  '--chrome-flags=--headless=new --enable-gpu', '--output=json', `--output-path=docs/performance/${label}-lighthouse.json`,
  '--save-assets', '--no-enable-error-reporting', '--quiet'];
const launchedAt = Date.now();
const child = spawn(process.execPath, args, { stdio: 'inherit', windowsHide: true });
const exitCode = await new Promise((resolve, reject) => { child.on('exit', resolve); child.on('error', reject); });
const measurement = JSON.parse(await readFile(`docs/performance/${label}-measured.json`, 'utf8'));
const lhr = JSON.parse(await readFile(`docs/performance/${label}-lighthouse.json`, 'utf8'));
const trace = JSON.parse(await readFile(`docs/performance/${label}-lighthouse-0.trace.json`, 'utf8'));
const measuredStat = await stat(`docs/performance/${label}-measured.json`);
const marks = trace.traceEvents.filter(event => event.name === 'portfolio:profile:start' || event.name === 'portfolio:profile:end');
if (measuredStat.mtimeMs < launchedAt || marks.length < 2 || measurement.width !== 390 || measurement.height !== 844 || measurement.durationMs < 11000 || lhr.configSettings.throttlingMethod !== 'devtools' || lhr.configSettings.throttling.cpuSlowdownMultiplier !== Number(rate)) throw new Error('Profile did not capture fresh counters, a complete trace interval, the requested viewport, and actual DevTools CPU throttle.');
if (exitCode !== 0) {
  if (lhr.runtimeError?.code !== 'NO_FCP') throw new Error(`Profiler exited ${exitCode}: ${lhr.runtimeError?.code}`);
  console.warn('Headless FCP scoring unavailable (NO_FCP). Complete runtime trace and verified frame counters were captured; no Lighthouse score is claimed.');
}
console.log(`Saved ${label} Chrome trace and measured app counters.`);
