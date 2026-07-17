# Changelog

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
