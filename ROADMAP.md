# Roadmap

## MVP shipped

- Freeze URL manifests into redacted fixture packs.
- Validate hashes, byte sizes, stale records, and likely secrets offline.
- Replay fixture packs with a tiny local HTTP server.
- Emit route maps for test harnesses.

## Next

- Optional request-body matching for non-GET fixtures.
- Fixture diff reports for intentional refreshes.
- Better binary body ergonomics and content previews.

This roadmap describes intended direction, not a binding delivery promise.
Review it regularly and update it as the project learns from users,
contributors, and implementation constraints.

## Now

- Define the smallest useful project scope.
- Keep repository setup, documentation, and verification easy for contributors
  to follow.
- Ship small, reviewable improvements.

## Next

- Add the next capabilities that directly support the project's primary users.
- Improve tests, docs, and examples around the most used workflows.
- Reduce setup friction discovered during early use.

## Later

- Consider larger features after the core workflow is stable.
- Add automation only where it removes repeated maintainer work.
- Revisit packaging, deployment, or integration options based on real demand.

## Not Planned

- Unrelated platform rewrites without a clear migration path.
- Mandatory dependencies on a single ecosystem unless the project requires it.
- Public release dates before maintainers are ready to commit to them.

## Roadmap Review

Before each major or meaningful minor release:

- Move completed user-visible work into `CHANGELOG.md`.
- Remove stale commitments.
- Promote only the next reviewable set of work into `Now`.
