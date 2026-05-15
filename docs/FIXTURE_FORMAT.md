# Fixture format

FetchFreeze packs are directories with this shape:

```txt
fixtures/http/
  fetchfreeze.json
  bodies/
    001-api-example.test-data.json
```

`fetchfreeze.json` uses schema `fetchfreeze.v1` and records:

- stable `id`
- HTTP `method` and source `url`
- response `status`
- ISO `recordedAt`
- redacted response `headers`
- relative `bodyFile`
- `bodySha256`
- `bodyBytes`
- optional `contentType`

The JSON writer sorts object keys and adds a trailing newline so reviews stay clean.
