# Safety model

FetchFreeze is intentionally local-first.

## What it avoids

- No hosted service.
- No telemetry.
- No account or API token requirement.
- No proxy daemon required for recording.

## Secret handling

Headers matching authorization, cookie, token, secret, API key, or set-cookie are redacted by default. Secret-looking values are also redacted in non-sensitive headers.

## Path handling

Fixture body paths must be relative and cannot include `..`, absolute roots, or Windows separators. This prevents fixture metadata from reading outside the pack.

## Reviewability

Generated metadata is deterministic JSON. Fixture updates should be committed intentionally and reviewed like source code.
