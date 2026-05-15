import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { readBody, readPack } from './io.js';
import { sha256Text } from './hash.js';
import { hasLikelySecret } from './redact.js';
import type { CheckIssue, CheckReport, FreezePack } from './types.js';

export interface CheckOptions {
  maxAgeDays?: number;
  offlineOk?: boolean;
  now?: Date;
}

export async function checkPack(dir: string, options: CheckOptions = {}): Promise<CheckReport> {
  const checkedAt = (options.now ?? new Date()).toISOString();
  const issues: CheckIssue[] = [];
  let pack: FreezePack;
  try {
    pack = await readPack(dir);
  } catch (error) {
    return { ok: false, checkedAt, recordCount: 0, issues: [{ level: 'error', code: 'PACK_READ_FAILED', message: String(error) }] };
  }

  const seen = new Set<string>();
  for (const record of pack.records) {
    if (seen.has(record.id)) issues.push({ level: 'error', code: 'DUPLICATE_ID', message: `Duplicate record id ${record.id}`, recordId: record.id });
    seen.add(record.id);
    await validateRecord(dir, record.id, record.bodyFile, record.bodySha256, record.bodyBytes, issues);
    validateAge(record.id, record.recordedAt, options, issues);
    validateSecrets(record.id, record.headers, issues);
  }

  return { ok: issues.every((issue) => issue.level !== 'error'), checkedAt, recordCount: pack.records.length, issues };
}

async function validateRecord(dir: string, id: string, bodyFile: string, expectedHash: string, expectedBytes: number, issues: CheckIssue[]): Promise<void> {
  try {
    const body = await readBody(dir, bodyFile);
    const actualHash = sha256Text(body);
    if (actualHash !== expectedHash) issues.push({ level: 'error', code: 'HASH_MISMATCH', message: `Body hash changed for ${bodyFile}`, recordId: id });
    if (body.byteLength !== expectedBytes) issues.push({ level: 'error', code: 'SIZE_MISMATCH', message: `Body size changed for ${bodyFile}`, recordId: id });
    await stat(join(dir, bodyFile));
  } catch {
    issues.push({ level: 'error', code: 'BODY_MISSING', message: `Missing body file ${bodyFile}`, recordId: id });
  }
}

function validateAge(id: string, recordedAt: string, options: CheckOptions, issues: CheckIssue[]): void {
  if (!options.maxAgeDays) return;
  const ageMs = (options.now ?? new Date()).getTime() - new Date(recordedAt).getTime();
  const maxMs = options.maxAgeDays * 24 * 60 * 60 * 1000;
  if (ageMs > maxMs) {
    issues.push({ level: options.offlineOk ? 'warning' : 'error', code: 'STALE_FIXTURE', message: `Fixture ${id} is older than ${options.maxAgeDays}d`, recordId: id });
  }
}

function validateSecrets(id: string, headers: Record<string, string>, issues: CheckIssue[]): void {
  for (const [key, value] of Object.entries(headers)) {
    if (hasLikelySecret(value)) issues.push({ level: 'error', code: 'LIKELY_SECRET', message: `Likely secret in header ${key}`, recordId: id });
  }
}
