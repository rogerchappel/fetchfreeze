import { expect, it } from 'vitest';
import { checkPack } from '../src/check.js';

it('passes a healthy fixture pack', async () => {
  const report = await checkPack('tests/fixtures/good', { now: new Date('2026-05-17T00:00:00Z'), maxAgeDays: 30 });
  expect(report.ok).toBe(true);
  expect(report.recordCount).toBe(1);
});

it('fails when fixture bodies drift', async () => {
  const report = await checkPack('tests/fixtures/bad', { now: new Date('2026-05-17T00:00:00Z') });
  expect(report.ok).toBe(false);
  expect(report.issues.map((issue) => issue.code)).toContain('HASH_MISMATCH');
});

it('can warn instead of fail for stale offline fixtures', async () => {
  const report = await checkPack('tests/fixtures/stale', { now: new Date('2026-05-17T00:00:00Z'), maxAgeDays: 30, offlineOk: true });
  expect(report.ok).toBe(true);
  expect(report.issues[0]?.code).toBe('STALE_FIXTURE');
  expect(report.issues[0]?.level).toBe('warning');
});
