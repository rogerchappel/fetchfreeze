import { FetchFreezeError } from './errors.js';

export function readOption(args: string[], name: string, fallback?: string): string | undefined {
  const equals = args.find((arg) => arg.startsWith(`${name}=`));
  if (equals) return equals.slice(name.length + 1);
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new FetchFreezeError(`Missing value for ${name}`, 'BAD_ARGS');
  return value;
}

export function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

export function parseDays(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = /^(\d+)(d)?$/.exec(value);
  if (!match) throw new FetchFreezeError(`Expected day duration like 30d, got ${value}`, 'BAD_ARGS');
  return Number(match[1]);
}

export function parseCsv(value: string | undefined): string[] {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}
