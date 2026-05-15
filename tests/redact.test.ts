import { expect, it } from 'vitest';
import { hasLikelySecret, redactHeaders, redactText } from '../src/redact.js';

it('redacts sensitive headers by default', () => {
  expect(redactHeaders({ authorization: 'Bearer abc123456789abcdef', 'content-type': 'application/json' })).toEqual({
    authorization: '[redacted]',
    'content-type': 'application/json'
  });
});

it('supports explicit header allowlists while still redacting values', () => {
  expect(redactHeaders({ authorization: 'Bearer abc123456789abcdef' }, ['authorization'])).toEqual({ authorization: '[redacted]' });
});

it('detects likely secret strings', () => {
  expect(redactText('token sk-abcdefghijklmnopqrstuvwxyz')).toContain('[redacted]');
  expect(hasLikelySecret('ghp_abcdefghijklmnopqrstuvwxyz')).toBe(true);
});
