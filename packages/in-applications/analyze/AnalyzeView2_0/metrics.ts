/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const metricRenderers = {
  calls: {
    calls: 'stackedBar',
    erroneousCalls: 'stackedBar',
    errors: 'stackedBar',
    latency: 'stackedArea'
  },
  traces: {
    erroneousCalls: 'stackedBar',
    errors: 'stackedBar',
    latency: 'stackedArea',
    traces: 'stackedBar'
  }
};
