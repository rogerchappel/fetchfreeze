import { readFile } from 'node:fs/promises';
import type { UrlManifestEntry } from './types.js';
import { FetchFreezeError } from './errors.js';

export async function readUrlManifest(path: string): Promise<UrlManifestEntry[]> {
  const raw = await readFile(path, 'utf8');
  if (path.endsWith('.json')) return parseJsonManifest(raw);
  return parseTextManifest(raw);
}

export function parseTextManifest(raw: string): UrlManifestEntry[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [maybeMethod, maybeUrl] = line.split(/\s+/, 2);
      const hasMethod = /^[A-Z]+$/.test(maybeMethod) && Boolean(maybeUrl);
      return normalizeEntry({ method: hasMethod ? maybeMethod : 'GET', url: hasMethod ? maybeUrl : line });
    });
}

export function parseJsonManifest(raw: string): UrlManifestEntry[] {
  const parsed = JSON.parse(raw) as unknown;
  const entries = Array.isArray(parsed) ? parsed : (parsed as { urls?: unknown }).urls;
  if (!Array.isArray(entries)) throw new FetchFreezeError('JSON manifest must be an array or { "urls": [] }', 'BAD_MANIFEST');
  return entries.map((entry) => normalizeEntry(typeof entry === 'string' ? { url: entry } : (entry as UrlManifestEntry)));
}

function normalizeEntry(entry: UrlManifestEntry): UrlManifestEntry {
  if (!entry.url) throw new FetchFreezeError('Manifest entry is missing url', 'BAD_MANIFEST');
  const url = new URL(entry.url);
  if (!['http:', 'https:'].includes(url.protocol)) throw new FetchFreezeError(`Unsupported URL protocol: ${url.protocol}`, 'BAD_URL');
  return { ...entry, method: (entry.method ?? 'GET').toUpperCase(), url: url.toString() };
}
