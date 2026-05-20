# falsify-js

> JavaScript reference implementation of the [PRML (Pre-Registered ML Manifest) v0.1](https://spec.falsify.dev/v0.1) specification.

[![npm](https://img.shields.io/npm/v/falsify-js.svg)](https://www.npmjs.com/package/falsify-js)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.20177839-blue.svg)](https://doi.org/10.5281/zenodo.20177839)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRML v0.1](https://img.shields.io/badge/PRML-v0.1-39D98A.svg)](https://spec.falsify.dev/v0.1)

PRML is an open CC BY 4.0 specification for committing ML evaluation claims to a SHA-256 hash before the experiment runs. `falsify-js` produces canonical bytes per the spec's §4 rules, byte-equivalent to the Python reference across **20 conformance vectors** (12 v0.1 stable + 8 v0.2 RFC).

Zero runtime dependencies. Single file, ~440 LOC. Works in Node ≥ 18 and any browser via Web Crypto.

## Install

```bash
npm install falsify-js
```

Or via the CLI:

```bash
npx falsify-js init my-claim
npx falsify-js lock manifest.yaml
```

## Quickstart — programmatic API

```js
import { canonicalize, manifestHash, validateManifest, evaluatePredicate } from 'falsify-js';

const manifest = {
  version: 'prml/0.1',
  claim_id: '01900000-0000-7000-8000-000000000000',
  created_at: '2026-05-09T20:00:00Z',
  metric: 'accuracy',
  comparator: '>=',
  threshold: 0.92,
  dataset: {
    id: 'imagenet-val-2012',
    hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  seed: 42,
  producer: { id: 'studio-11.co' },
};

// Validate structure
const errors = validateManifest(manifest);
if (errors.length) throw new Error(errors.join(', '));

// Compute canonical bytes + SHA-256
const canonical = canonicalize(manifest);
const hash = manifestHash(manifest);

console.log(hash);
// e.g. 267497d5efc599a9003b3f0ca8e64676ec0b5e329efc24f570e13dfcc0a7ccb0

// Later, evaluate the run's verdict:
const observed = 0.94;
const verdict = evaluatePredicate(observed, manifest.comparator, manifest.threshold);
// verdict === true → claim holds
```

## CLI

```bash
falsify-js init <name>                    # create skeleton manifest
falsify-js lock <path>                    # canonicalize + hash + write sidecar
falsify-js verify <path> --observed 0.94  # verify hash + evaluate verdict
falsify-js test-vectors <vectors.json>    # run conformance suite
```

Exit codes match the Python reference:

- `0` — pass
- `3` — tampered (hash mismatch)
- `10` — fail (verdict false)

## Public API

| Function | Returns |
|---|---|
| `canonicalize(obj)` | string — UTF-8 canonical bytes per spec §4 |
| `manifestHash(obj)` | string — SHA-256 hex |
| `validateManifest(obj)` | string[] — error messages (empty array = valid) |
| `evaluatePredicate(observed, comparator, threshold)` | boolean |

## Cross-language byte-equivalence

This package is one of four reference implementations. Each produces identical SHA-256 hashes for the same canonical input:

- Python: [`pip install falsify`](https://pypi.org/project/falsify/) ([source](https://github.com/studio-11-co/falsify))
- JavaScript: this package
- Go: [source under `studio-11-co/falsify/impl/go`](https://github.com/studio-11-co/falsify/tree/main/impl/go)
- Rust: [source under `studio-11-co/falsify/impl/rust`](https://github.com/studio-11-co/falsify/tree/main/impl/rust)

Cross-implementation parity is mechanically verified on every commit via the [multi-language conformance workflow](https://github.com/studio-11-co/falsify/blob/main/.github/workflows/multi-lang-conformance.yml).

## What this does *not* do

- **Does not enforce thresholds.** The spec is a serialisation primitive; enforcement is the caller's job (CI gate, audit firm, regulator).
- **Does not solve selective publication.** PRML §8.1 names this limit explicitly. A publisher can pre-register many claims and publish only the favourable ones.
- **Does not specify which execution attestations are valid.** The v0.2 RFC adds an optional `runner_attestation` URI field; PRML records that an attestation was emitted, not what it contains.


## Audit & compliance crosswalks

Subcategory-by-subcategory maps from major AI governance frameworks to PRML fields (FULL / PARTIAL / NONE tagged):

- [EU AI Act Article 12](https://spec.falsify.dev/eu-ai-act/article-12/) — code-level pattern for the 2 August 2026 high-risk deadline
- [NIST AI RMF 1.0](https://spec.falsify.dev/nist-ai-rmf/) — GOVERN / MAP / MEASURE / MANAGE subcategory map
- [ISO/IEC 42001:2023](https://spec.falsify.dev/iso-42001/) — AI Management System clause-by-clause evidence map

## Spec & licensing

- Spec: [spec.falsify.dev/v0.1](https://spec.falsify.dev/v0.1) (CC BY 4.0)
- v0.2 RFC (open through 2026-05-22): [spec.falsify.dev/v0.2-rfc](https://spec.falsify.dev/v0.2-rfc)
- JSON Schema: [spec.falsify.dev/schema/](https://spec.falsify.dev/schema/)
- Patent non-assertion grant: [appendix of the spec](https://spec.falsify.dev/v0.1#appendix-patent-grant)
- This package: MIT

## Related

- [`prml-verify-action`](https://github.com/studio-11-co/prml-verify-action) — GitHub Action wrapping the Python CLI for CI verdicts
- [`falsify-inspect`](https://pypi.org/project/falsify-inspect/) — adapter for Inspect AI eval logs
- [`falsify-cookbook`](https://github.com/studio-11-co/falsify-cookbook) — 10 patterns + 4 anti-patterns + 4 working examples
- [`falsify-integrity-index`](https://falsify.dev/integrity) — public scorecard of 25 well-known eval claims

## Authors

Cüneyt Öztürk, co-founder, Studio 11 Turkey Ltd. Şti.
Contact: hello@studio-11.co · [falsify.dev](https://falsify.dev)


---

## Status

- v0.1 stable. v0.2 RFC open through 2026-05-22 — [spec.falsify.dev/v0.2-rfc](https://spec.falsify.dev/v0.2-rfc).
- The PRML JSON Schema is in the [SchemaStore catalog](https://www.schemastore.org/json/) (merged 2026-05-11), so `*.prml.yaml` files autocomplete in VS Code, JetBrains, Helix, Zed, and Cursor out of the box.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and the [`good first issue`](https://github.com/studio-11-co/falsify-js/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) label for scoped work.

**Cite the spec:** Öztürk, C. (2026). *PRML v0.1*. Zenodo. [https://doi.org/10.5281/zenodo.20177839](https://doi.org/10.5281/zenodo.20177839)
