# Changelog

## [0.1.12] - 2026-08-13

### Fixed
- `linkage` default timestamps now keep millisecond precision, so a
  sub-second run still satisfies the spec's strict
  `started_at < finished_at` chronology check (previously both defaulted
  to whole seconds and could collide). Explicitly passed timestamps are
  unaffected.

## [0.1.11] - 2026-08-13

### Added
- **Experimental `linkage` module** — reference implementation of the
  `prml-linkage/0` draft (execution linkage: start/final record chaining,
  tiers L1/L2/L3, offline verification). `require('falsify-js').linkage`
  or `import { linkage } from 'falsify-js'`; also exported as the
  `falsify-js/linkage` subpath. Draft API — may change until draft 0
  freezes. Spec: studio-11-co/falsify `spec/linkage/prml-linkage-0.md`.
- Canonicalizer renders `prml-linkage/0` records with the spec's observed
  float rule (integer-valued `observed` renders as `x.0`), byte-parity
  with the Python reference asserted upstream by cross-language tests.

## [0.1.10] - 2026-07-31

### Changed
- `validateManifest` now enforces the full published JSON Schema, in lockstep
  with the Python reference and impl/js as of falsify v0.3.12: UUIDv7
  `claim_id`, RFC 3339 `created_at`, metric length, integer/bigint-or-null
  `seed`, sub-object and top-level `additionalProperties: false`,
  `prior_hash` and `notes` constraints. **Breaking** for manifests that
  relied on the previous looser validation (most commonly non-UUIDv7 claim
  identifiers). Prompted by the independent Andes interoperability
  assessment (2026-07-28, finding 1).

## [0.1.9] - 2026-07-17

### Fixed
- `==` comparator now uses the spec 5.1 tolerance (default 1e-9, overridable via metric_args.tolerance) instead of exact float equality, matching the Python reference and impl/js. Fixes the 0.1 + 0.2 == 0.3 footgun. Byte-identical with impl/js in the spec repo (CI drift-diff).

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2026-07-12

Corrections release. No functional change to canonicalization or hashing:
hashes produced by 0.1.8 are identical to 0.1.7.

### Fixed

- README and CITATION.cff no longer claim the package "works in any browser
  via Web Crypto". That was not true: the code depends on Node's `fs` and
  `crypto` modules and no browser build is packaged. Honest statement:
  Node.js >= 18, CLI + library; the registry serves its own browser verifier.
- README exit-code list now documents all five codes (0 pass, 2 bad input,
  3 tampered, 10 fail, 11 guard); it previously omitted 2 and 11.

### Changed

- `test.js` no longer hard-depends on a `../falsify-hackathon` sibling
  checkout. Vector sources, in order: `$PRML_VECTORS_DIR`, the sibling
  checkout, then raw.githubusercontent.com at a pinned spec commit. It exits 1
  if the vectors cannot be loaded and asserts exact suite sizes (13 v0.1 +
  8 v0.2), so a silent partial fetch fails loudly. The single-vector bundled
  fallback is gone.
- CI now fetches both conformance suites plus the 14-vector reject suite at a
  pinned spec-repo commit, runs the reject suite against `falsify.js lock`,
  and adds a drift-diff job that fails if `falsify.js` differs from
  `impl/js/falsify.js` in the spec repo at that same commit.
- `test.js` is now included in the published package (`files` array), so
  `npm test` works from an installed copy, not only from the repo.
