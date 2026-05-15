import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FreezePack } from './types.js';
import { stableJson } from './hash.js';
import { assertSafeRelativePath } from './errors.js';

export const PACK_FILE = 'fetchfreeze.json';
export const BODY_DIR = 'bodies';

export async function ensurePackDirs(outDir: string): Promise<void> {
  await mkdir(join(outDir, BODY_DIR), { recursive: true });
}

export async function writePack(outDir: string, pack: FreezePack): Promise<void> {
  await ensurePackDirs(outDir);
  await writeFile(join(outDir, PACK_FILE), stableJson(pack), 'utf8');
}

export async function readPack(dir: string): Promise<FreezePack> {
  const raw = await readFile(join(dir, PACK_FILE), 'utf8');
  const pack = JSON.parse(raw) as FreezePack;
  if (pack.schema !== 'fetchfreeze.v1' || !Array.isArray(pack.records)) {
    throw new Error(`Invalid fetchfreeze pack at ${dir}`);
  }
  return pack;
}

export async function writeBody(outDir: string, relativePath: string, body: Uint8Array): Promise<void> {
  assertSafeRelativePath(relativePath);
  await ensurePackDirs(outDir);
  await writeFile(join(outDir, relativePath), body);
}

export async function readBody(dir: string, relativePath: string): Promise<Buffer> {
  assertSafeRelativePath(relativePath);
  return readFile(join(dir, relativePath));
}
