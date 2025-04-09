/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */



let infraPluginsEvaluated = false;
export function ensureInfraPluginsAreEvaluated() {
  if (!infraPluginsEvaluated) {
    infraPluginsEvaluated = true;

    /* eslint-ignore-next-line no-require */
    require('in-forge/plugins');
  }
}

let tracingPluginsEvaluated = false;
export function ensurTracingPluginsAreEvaluated() {
  if (!tracingPluginsEvaluated) {
    tracingPluginsEvaluated = true;

    /* eslint-ignore-next-line no-require */
    require('in-forge/tracing');
  }
}
