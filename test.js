#!/usr/bin/env node
// Node.js native test runner — no external dependencies. Tests the JS
// reference impl against the 12 v0.1 conformance vectors locked in the
// spec repo. Run via `npm test`.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { canonicalize, manifestHash, evaluatePredicate, validateManifest } = require('./falsify.js');

// Locate the v0.1 test vectors. Prefer the sibling falsify-hackathon checkout;
// fall back to the upstream raw URL if the sibling isn't present (CI fetches it).
// JSON parser that preserves precision for large integers via BigInt
// (mirrors the CLI's `test-vectors` subcommand). JS Number loses precision
// above 2^53; PRML's seed field allows uint64.
function parseWithBigInt(raw) {
  const wrapped = raw.replace(/(?<=[\s:,\[])(\-?\d{16,})(?=[\s,\]\}])/g, '"__BIGINT__$1"');
  const obj = JSON.parse(wrapped);
  function unwrap(o) {
    if (typeof o === 'string' && o.startsWith('__BIGINT__')) return BigInt(o.slice(10));
    if (Array.isArray(o)) return o.map(unwrap);
    if (o !== null && typeof o === 'object') {
      const out = {};
      for (const k of Object.keys(o)) out[k] = unwrap(o[k]);
      return out;
    }
    return o;
  }
  return unwrap(obj);
}

function loadVectors() {
  const local = path.resolve(
    __dirname, '..', 'falsify-hackathon', 'spec', 'test-vectors', 'v0.1', 'test-vectors.json'
  );
  if (fs.existsSync(local)) {
    return parseWithBigInt(fs.readFileSync(local, 'utf-8'));
  }
  // Bundled fallback: a single vector to give CI signal even without sibling repo
  return [
    {
      id: 'TV-SMOKE',
      title: 'Smoke vector — minimal valid manifest',
      input: {
        version: 'prml/0.1',
        claim_id: '01900000-0000-7000-8000-000000000000',
        created_at: '2026-05-01T12:00:00Z',
        metric: 'accuracy',
        comparator: '>=',
        threshold: 0.85,
        dataset: { id: 'imagenet-val-2012', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        seed: 42,
        producer: { id: 'studio-11.co' },
      },
      hash: '1a3466cc08ee7fb60a726ea1c4db6ecf48a9f847b9b7523bfb54b2ffaefee546',
    },
  ];
}

const VECTORS = loadVectors();

test('exports public API', () => {
  for (const fn of ['canonicalize', 'manifestHash', 'evaluatePredicate', 'validateManifest']) {
    assert.equal(typeof require('./falsify.js')[fn], 'function', `missing export: ${fn}`);
  }
});

test('manifestHash is deterministic', () => {
  const m = VECTORS[0].input;
  assert.equal(manifestHash(m), manifestHash(m));
  assert.equal(manifestHash(m), VECTORS[0].hash);
});

test('canonicalize sorts keys lexicographically', () => {
  const a = canonicalize({ b: 2, a: 1 });
  const b = canonicalize({ a: 1, b: 2 });
  assert.equal(a, b);
});

test('evaluatePredicate handles all five comparators (returns boolean)', () => {
  assert.equal(evaluatePredicate(0.95, '>=', 0.9), true);
  assert.equal(evaluatePredicate(0.85, '>=', 0.9), false);
  assert.equal(evaluatePredicate(0.5,  '<=', 0.6), true);
  assert.equal(evaluatePredicate(1.0,  '==', 1.0), true);
  assert.equal(evaluatePredicate(0.91, '>',  0.9), true);
  assert.equal(evaluatePredicate(0.91, '<',  0.9), false);
});

test('validateManifest accepts canonical manifests (returns empty error array)', () => {
  for (const v of VECTORS) {
    const errors = validateManifest(v.input);
    assert.equal(Array.isArray(errors), true, `${v.id}: expected array, got ${typeof errors}`);
    assert.equal(errors.length, 0, `${v.id} should validate: ${JSON.stringify(errors)}`);
  }
});

test(`all ${VECTORS.length} v0.1 conformance vectors hash byte-equivalently`, () => {
  let passed = 0;
  for (const v of VECTORS) {
    const got = manifestHash(v.input);
    assert.equal(got, v.hash, `${v.id}: ${v.title}\n  expected ${v.hash}\n  got      ${got}`);
    passed += 1;
  }
  assert.equal(passed, VECTORS.length);
});
