export const helpText = `fetchfreeze ❄️ deterministic HTTP fixtures for local-first tests

Usage:
  fetchfreeze record <manifest> --out <dir> [--allow-headers a,b] [--dry-run]
  fetchfreeze check <dir> [--max-age 30d] [--offline-ok] [--json]
  fetchfreeze replay <dir> [--port 4177] [--host 127.0.0.1]
  fetchfreeze map <dir> [--base-url http://127.0.0.1:4177] [--pretty]

Commands:
  record   Fetch URLs from a text or JSON manifest and freeze redacted responses.
  check    Verify fixture bodies, hashes, freshness budgets, and likely secrets.
  replay   Start a tiny local HTTP server that serves frozen responses.
  map      Print path mapping JSON for tests that do not need a server.

Safety defaults:
  - Secret-like headers and values are redacted unless explicitly allowlisted.
  - Offline freshness checks can warn instead of fail with --offline-ok.
  - Fixture body paths are constrained to safe relative paths.
`;
