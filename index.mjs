// ESM entry — re-exports as named bindings for `import { ... } from 'falsify-js'`.
// The reference implementation lives in CommonJS (`falsify.js`); this thin
// wrapper exposes the public API as ES module named exports so TypeScript
// projects and ESM-only consumers get tree-shakeable imports.
import pkg from './index.js';

export const canonicalize = pkg.canonicalize;
export const manifestHash = pkg.manifestHash;
export const validateManifest = pkg.validateManifest;
export const evaluatePredicate = pkg.evaluatePredicate;
export const needsQuoting = pkg.needsQuoting;
export const EXIT_PASS = pkg.EXIT_PASS;
export const EXIT_BAD = pkg.EXIT_BAD;
export const EXIT_TAMPERED = pkg.EXIT_TAMPERED;
export const EXIT_FAIL = pkg.EXIT_FAIL;
export const EXIT_GUARD = pkg.EXIT_GUARD;

export default pkg;
