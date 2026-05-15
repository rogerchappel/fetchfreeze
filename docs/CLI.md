# FetchFreeze CLI

## `record <manifest> --out <dir>`

Fetches every URL in a text or JSON manifest and writes a fixture pack:

- `fetchfreeze.json` stores deterministic metadata, response status, redacted headers, body path, body hash, and byte length.
- `bodies/*` stores captured response bodies.

Options:

- `--allow-headers a,b` keeps named sensitive headers, while still redacting secret-looking values.
- `--dry-run` fetches and reports without writing files.

## `check <dir>`

Validates fixture metadata against local body files. It never needs the network.

Options:

- `--max-age 30d` marks stale records.
- `--offline-ok` downgrades staleness to warnings.
- `--json` prints a machine-readable report.

## `replay <dir>`

Starts a tiny local HTTP server and serves frozen bodies by method, path, and query string.

## `map <dir>`

Prints JSON route mappings for tests that prefer direct lookup over a server.
