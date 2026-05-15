import { describe, expect, it } from 'vitest';
import { parseJsonManifest, parseTextManifest } from '../src/manifest.js';

it('parses text URL manifests deterministically', () => {
  expect(parseTextManifest('# comment\nGET https://example.com/a\nhttps://example.com/b')).toEqual([
    { method: 'GET', url: 'https://example.com/a' },
    { method: 'GET', url: 'https://example.com/b' }
  ]);
});

it('parses JSON URL manifests with headers', () => {
  expect(parseJsonManifest('{"urls":[{"url":"https://example.com/docs","headers":{"accept":"text/html"}}]}')).toEqual([
    { method: 'GET', url: 'https://example.com/docs', headers: { accept: 'text/html' } }
  ]);
});

describe('manifest validation', () => {
  it('rejects non-http protocols', () => {
    expect(() => parseTextManifest('file:///tmp/secret')).toThrow(/Unsupported URL protocol/);
  });
});
