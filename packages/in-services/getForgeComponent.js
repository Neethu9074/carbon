/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* global require:false */

const context = require.context('../in-forge/plugins', true, /\/[a-zA-Z0-9]+\.js$/, 'lazy-once');

export function getForgeComponent(path) {
  return context(path).then(mod => mod.default);
}
