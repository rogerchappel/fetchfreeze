import type { HeaderMap } from './types.js';

const SECRET_HEADER_PATTERNS = [/authorization/i, /cookie/i, /token/i, /secret/i, /api[-_]?key/i, /set-cookie/i];
const SECRET_VALUE_PATTERNS = [
  /bearer\s+[a-z0-9._~+/-]+=*/gi,
  /sk-[a-z0-9]{12,}/gi,
  /gh[pousr]_[a-z0-9_]{12,}/gi,
  /[A-Za-z0-9+/]{32,}={0,2}/g
];

export function normalizeHeaders(headers: Headers | HeaderMap | undefined): HeaderMap {
  const pairs = headers instanceof Headers ? Array.from(headers.entries()) : Object.entries(headers ?? {});
  return Object.fromEntries(pairs.map(([key, value]) => [key.toLowerCase(), String(value)]).sort(([a], [b]) => a.localeCompare(b)));
}

export function redactHeaders(headers: HeaderMap, allowlist: string[] = []): HeaderMap {
  const allowed = new Set(allowlist.map((header) => header.toLowerCase()));
  const result: HeaderMap = {};
  for (const [key, value] of Object.entries(headers).sort(([a], [b]) => a.localeCompare(b))) {
    if (SECRET_HEADER_PATTERNS.some((pattern) => pattern.test(key)) && !allowed.has(key)) {
      result[key] = '[redacted]';
    } else {
      result[key] = redactText(value);
    }
  }
  return result;
}

export function redactText(value: string): string {
  return SECRET_VALUE_PATTERNS.reduce((text, pattern) => text.replace(pattern, '[redacted]'), value);
}

export function hasLikelySecret(value: string): boolean {
  return SECRET_VALUE_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(value);
  });
}
