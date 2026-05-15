# FetchFreeze PRD

Status: in-progress

## One-liner

Deterministic HTTP fixture freezer for agentic CLIs ❄️

## Problem

Agent-built CLIs often depend on remote docs, package metadata, or API samples. Tests become flaky when the network changes, and recorded fixtures often leak headers or credentials.

## Proposed solution

A local-first CLI that records HTTP responses into redacted fixture packs, validates freshness budgets, and replays frozen responses from disk for tests and agent smokes.

## Primary users

CLI authors, agentic workflow builders, maintainers who want reproducible tests without running a proxy service.

## V1 scope

- Record URL manifests with method, headers allowlist, status, body hash, and captured body
- Redact secrets from request/response metadata with safe defaults
- Replay fixtures through a tiny local HTTP server or export path mapping JSON
- Check fixture drift/freshness without failing offline by default
- Generate Vitest-friendly helper snippets and shell smoke examples

## CLI shape

```bash
fetchfreeze record urls.txt --out fixtures/http
fetchfreeze replay fixtures/http --port 4177
fetchfreeze check fixtures/http --max-age 30d --offline-ok
```

## Non-goals

- No hosted service, hidden telemetry, or required account.
- No secret collection; fixture and metadata redaction should be conservative.
- No broad framework lock-in beyond a practical Node/TypeScript CLI MVP.

## Local-first safety

- Default to dry-run or read-only behavior for write/apply style commands.
- Keep generated artifacts deterministic and reviewable.
- Fail closed on suspicious paths, binary blobs, or likely secrets.

## Acceptance criteria

- Functional CLI with help text and at least three useful commands.
- Fixture-backed tests covering happy path, validation failure, and deterministic output.
- README with concise examples, safety notes, and practical developer workflow.
- `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh` pass where present.
- Public GitHub repo under `rogerchappel/fetchfreeze` with description and topics.

## Attribution / inspiration

Inspired by common VCR-style HTTP fixture workflows, reframed as a tiny deterministic tool for local agentic CLI testing.
