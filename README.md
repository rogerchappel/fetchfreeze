# fetchfreeze ❄️

Deterministic HTTP fixture freezer for agentic CLIs and local-first test suites.

FetchFreeze records the small bits of the web your CLI depends on, redacts risky metadata, and replays those responses from disk so tests stay boring when the network gets weird.

## Why it exists

Agent-built tools often fetch docs, package metadata, examples, or API samples. That is great in production and miserable in tests: the remote page changes, a header leaks, or CI is offline. FetchFreeze gives you a tiny VCR-style workflow without a proxy service, account, telemetry, or framework lock-in.

## Install

```sh
npm install --save-dev fetchfreeze
```

For local development in this repository:

```sh
npm install
npm run build
```

## CLI quick start

Create a manifest:

```txt
# examples/urls.txt
GET https://api.example.test/data.json
```

Record fixtures:

```sh
fetchfreeze record examples/urls.txt --out fixtures/http
```

Check fixture integrity and freshness:

```sh
fetchfreeze check fixtures/http --max-age 30d --offline-ok
```

Replay from a tiny local server:

```sh
fetchfreeze replay fixtures/http --port 4177
```

Or export a route map for tests that do not need a server:

```sh
fetchfreeze map fixtures/http --pretty
```

## Manifest formats

Text manifests accept one URL per line, with an optional method:

```txt
GET https://example.com/docs
POST https://example.com/search
```

JSON manifests accept either an array or `{ "urls": [] }`:

```json
{
  "urls": [
    {
      "id": "docs-home",
      "method": "GET",
      "url": "https://example.com/docs",
      "headers": { "accept": "text/html" }
    }
  ]
}
```

## Safety defaults

- Authorization, cookie, token, secret, and API-key-like headers are redacted by default.
- Secret-looking values are redacted even when a header is allowlisted.
- Fixture body paths are constrained to safe relative paths.
- `check --offline-ok` turns stale fixtures into warnings so offline work can continue.
- Generated fixture packs are deterministic JSON and easy to review.

## Repository workflow

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

A real fixture-backed smoke is included under `examples/fixtures`.

## Contributing and security

Please read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Keep changes small, tested, and PR-linked.

## License

MIT

## Development

Run the same checks locally before opening a change:

```sh
npm ci
npm run check
npm run build
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

## Release readiness

Before opening a release PR, run the same checks that CI runs:

```sh
npm run release:check
npm pack --dry-run
```

The package smoke keeps the published tarball contents visible before tagging or publishing.
