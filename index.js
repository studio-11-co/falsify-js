// public API entry — re-exports from falsify.js
module.exports = require('./falsify.js');

// Experimental: prml-linkage/0 draft (spec/linkage/prml-linkage-0.md).
// API may change until draft 0 freezes.
module.exports.linkage = require('./linkage.js');
