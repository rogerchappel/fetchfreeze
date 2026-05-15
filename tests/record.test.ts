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
  expect(pack.records[0]?.bodySha256).toBe('e4285e53e892b80c86a0e801cbbcf29d3267e2c77ec07f83ebca4d5311a06da4');
  await expect(readFile(join(outDir, pack.records[0]!.bodyFile), 'utf8')).resolves.toBe('{"ok":true}\n');
});
