import { basename } from 'node:path';
import { BODY_DIR, writeBody, writePack } from './io.js';
import { normalizeHeaders, redactHeaders } from './redact.js';
import { sha256Text } from './hash.js';
import type { FreezePack, FreezeRecord, RecordOptions, UrlManifestEntry } from './types.js';

export async function recordManifest(entries: UrlManifestEntry[], options: RecordOptions): Promise<FreezePack> {
  const records: FreezeRecord[] = [];
  const bodies = new Map<string, Uint8Array>();
  for (const [index, entry] of entries.entries()) {
    const { record, body } = await captureEntry(entry, index, options);
    records.push(record);
    bodies.set(record.bodyFile, body);
  }
  const pack: FreezePack = { schema: 'fetchfreeze.v1', createdAt: new Date().toISOString(), records };
  if (!options.dryRun) await writePackWithBodies(options.outDir, pack, bodies);
  return pack;
}

async function captureEntry(entry: UrlManifestEntry, index: number, options: RecordOptions): Promise<{ record: FreezeRecord; body: Uint8Array }> {
  const method = (entry.method ?? 'GET').toUpperCase();
  const response = await fetch(entry.url, { method, headers: entry.headers });
  const bytes = new Uint8Array(await response.arrayBuffer());
  const bodySha256 = sha256Text(bytes);
  const id = entry.id ?? `${String(index + 1).padStart(3, '0')}-${slugForUrl(entry.url)}`;
  const extension = extensionForContentType(response.headers.get('content-type'));
  return {
    record: {
      id,
      method,
      url: entry.url,
      status: response.status,
      recordedAt: new Date().toISOString(),
      headers: redactHeaders(normalizeHeaders(response.headers), options.headerAllowlist),
      bodyFile: `${BODY_DIR}/${id}${extension}`,
      bodySha256,
      bodyBytes: bytes.byteLength,
      contentType: response.headers.get('content-type') ?? undefined
    },
    body: bytes
  };
}

async function writePackWithBodies(outDir: string, pack: FreezePack, bodies: Map<string, Uint8Array>): Promise<void> {
  for (const record of pack.records) {
    const body = bodies.get(record.bodyFile);
    if (body) await writeBody(outDir, record.bodyFile, body);
  }
  await writePack(outDir, pack);
}

export function slugForUrl(urlValue: string): string {
  const url = new URL(urlValue);
  const pathPart = basename(url.pathname) || url.hostname;
  return `${url.hostname}-${pathPart}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function extensionForContentType(contentType: string | null): string {
  if (!contentType) return '.body';
  if (contentType.includes('json')) return '.json';
  if (contentType.startsWith('text/') || contentType.includes('xml')) return '.txt';
  return '.body';
}
