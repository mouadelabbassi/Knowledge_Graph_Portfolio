import { mkdir, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';

export async function collectProfile(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') { response.writeHead(405).end(); return; }
  let body = '';
  for await (const chunk of request) {
    body += String(chunk);
    if (body.length > 100000) { response.writeHead(413).end(); return; }
  }
  try {
    const data = JSON.parse(body) as { label?: string };
    if (!data.label || !/^(baseline|fixed|m2)-(1x|4x)$/.test(data.label)) { response.writeHead(400).end(); return; }
    await mkdir('docs/performance', { recursive: true });
    await writeFile(`docs/performance/${data.label}-measured.json`, JSON.stringify(data, null, 2));
    response.writeHead(204).end();
  } catch { response.writeHead(400).end(); }
}
