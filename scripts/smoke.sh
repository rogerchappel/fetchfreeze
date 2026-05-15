#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null
node dist/src/cli.js check examples/fixtures --max-age 9999d --offline-ok
node dist/src/cli.js map examples/fixtures --pretty >/tmp/fetchfreeze-map.json
grep -q 'api.example.test/data.json' /tmp/fetchfreeze-map.json
printf 'fetchfreeze smoke passed\n'
