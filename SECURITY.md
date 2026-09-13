# Security Policy — falsify-js (npm)

## Reporting a vulnerability

Email **hello@falsify.dev** with the subject prefix `[SECURITY]`. Include a
description, the affected component and version, and a reproduction if you have
one. We aim to acknowledge within 3 working days and to say, within 10, whether
we consider it a vulnerability and what we intend to do. Do not open a public
issue for a suspected vulnerability.

There is no bug bounty. Credit is given in the changelog if you want it.

## Supported versions

| Version | Supported |
|---|---|
| 0.2.x (current) | yes |
| 0.1.x | no — 0.1.13 and earlier cannot read YAML from a clean install and disagree with the reference canonicalizer on edge inputs; upgrade |

## Trust model

`falsify-js lock`, `verify`, `hash` and `test-vectors` only read, canonicalize,
hash and compare. A manifest is plain data; nothing in it is executed. The package
has one runtime dependency, `js-yaml`, loaded with `CORE_SCHEMA` so no custom or
JavaScript type tags can be instantiated from manifest content. Prototype-polluting
keys (`__proto__`, `constructor`, `prototype`) are rejected before use.

What this package does **not** protect against is stated in the specification
(§8.1): a producer who never publishes, publishes selectively, or colludes on the
dataset. Those need external anchoring, not code.

## Release integrity

Releases are published from the maintainer's terminal with security-key 2FA
(npm provenance attestations are not yet enabled — see the changelog). Every
release is tagged in git (`vX.Y.Z`) from 0.2.0 onward; compare the tarball
against the tag if you need to.
