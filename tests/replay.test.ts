import { afterEach, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { startReplayServer } from '../src/replay.js';

let server: Server | undefined;
afterEach(async () => {
  if (server) await new Promise<void>((resolve) => server?.close(() => resolve()));
  server = undefined;
});

it('replays a frozen body from the local server', async () => {
  server = await startReplayServer({ dir: 'tests/fixtures/good', port: 0 });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('expected TCP address');
  const response = await fetch(`http://127.0.0.1:${address.port}/data.json`);
  await expect(response.json()).resolves.toEqual({ name: 'fetchfreeze', ok: true });
  expect(response.headers.get('x-fetchfreeze-record')).toBe('001-api-example.test-data');
});
