import { expect, it } from 'vitest';
import { main } from '../src/cli.js';

it('prints help successfully', async () => {
  await expect(main(['--help'])).resolves.toBe(0);
});

it('returns non-zero for invalid fixture packs', async () => {
  await expect(main(['check', 'tests/fixtures/bad', '--json'])).resolves.toBe(1);
});

it('prints route maps from the CLI', async () => {
  await expect(main(['map', 'tests/fixtures/good'])).resolves.toBe(0);
});
