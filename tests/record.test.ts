import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { recordManifest } from '../src/record.js';

let outDir: string | undefined;
afterEach(async () => {
  vi.restoreAllMocks();
  if (outDir) await rm(outDir, { recursive: true, force: true });
});

it('records responses with redacted metadata and deterministic body hashes', async () => {
  outDir = await mkdtemp(join(tmpdir(), 'fetchfreeze-'));
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{"ok":true}\n', {
    status: 200,
    headers: { 'content-type': 'application/json', authorization: 'Bearer abc123456789abcdef' }
  })));

  const pack = await recordManifest([{ url: 'https://example.com/api' }], { outDir, headerAllowlist: [] });

  expect(pack.records[0]?.headers.authorization).toBe('[redacted]');
  expect(pack.records[0]?.bodySha256).toBe('e5f1eb4d806641698a35efe20e098efd20d7d57a9b90ee69079d5bb650920726');
  await expect(readFile(join(outDir, pack.records[0]!.bodyFile), 'utf8')).resolves.toBe('{"ok":true}\n');
});
