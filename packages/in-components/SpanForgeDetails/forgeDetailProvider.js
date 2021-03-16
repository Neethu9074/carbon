/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* global require:false */

const context = require.context('../../in-forge/tracing', true, /\/[a-zA-Z0-9]+\.js$/);

export default function loadSpanDetailComponent(type, detailViewPath) {
  return context('./' + type + '/' + detailViewPath + '.js').default;
}
