# Examples

## Fixture-backed smoke

`examples/fixtures` is a committed pack used by `npm run smoke`:

```sh
node dist/src/cli.js check examples/fixtures --max-age 9999d --offline-ok
node dist/src/cli.js map examples/fixtures --pretty
```

## Recording from a text manifest

```sh
fetchfreeze record examples/urls.txt --out fixtures/http
```

## Recording from JSON

```sh
fetchfreeze record examples/manifest.json --out fixtures/docs
```

Use `--dry-run` when you want to inspect the record plan without writing files.
