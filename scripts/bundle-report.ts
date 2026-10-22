import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

interface Chunk { file: string; isEntry?: boolean; imports?: string[]; dynamicImports?: string[] }
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8')) as Record<string, Chunk>;
const entry = Object.keys(manifest).find(key => manifest[key]?.isEntry);
if (!entry) throw new Error('Build entry missing from manifest.');
const initialKeys = new Set<string>();
function collect(key: string) {
  if (initialKeys.has(key)) return;
  initialKeys.add(key);
  manifest[key]?.imports?.forEach(collect);
}
collect(entry);
const chunks = await Promise.all(Object.entries(manifest).filter(([, chunk]) => chunk.file.endsWith('.js')).map(async ([key, chunk]) => {
  const content = await readFile(`dist/${chunk.file}`);
  return { file: chunk.file, bytes: content.length, gzipBytes: gzipSync(content).length, initial: initialKeys.has(key) };
}));
const initialGzipBytes = chunks.filter(chunk => chunk.initial).reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
const report = { initialGzipBytes, initialGzipKB: +(initialGzipBytes / 1024).toFixed(2), budgetKB: 300, chunks };
await mkdir('docs', { recursive: true });
await writeFile('docs/bundle-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Initial JS: ${report.initialGzipKB} KB gzip. Budget: <300 KB. Lazy scene excluded.`);
if (initialGzipBytes >= 300 * 1024) throw new Error('Initial JS exceeded 300 KB gzip budget.');
