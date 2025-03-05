/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const resourceSizeMetrics = {
  encodedBodySize: 'stackedArea',
  decodedBodySize: 'stackedArea',
  transferSize: 'stackedArea'
};

export const metricRenderers = {
  sessionStart: {
    beaconCount: 'stackedBar',
    sessions: 'stackedBar',
    uniqueUsersOrSessions: 'stackedBar'
  },
  viewChange: {
    beaconCount: 'stackedBar',
    views: 'stackedBar',
    uniqueUsersOrSessions: 'stackedBar'
  },
  httpRequest: {
    beaconCount: 'stackedBar',
    beaconErrorCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    beaconErrorRate: 'stackedBar',
    uniqueUsersOrSessions: 'stackedBar',
    ...resourceSizeMetrics,
    http1xx: 'stackedBar',
    http2xx: 'stackedBar',
    http3xx: 'stackedBar',
    http4xx: 'stackedBar',
    http5xx: 'stackedBar',
    httpGet: 'stackedBar',
    httpPost: 'stackedBar',
    httpPut: 'stackedBar',
    httpDelete: 'stackedBar'
  },
  custom: {
    beaconCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    uniqueUsersOrSessions: 'stackedBar'
  },
  crash: {
    beaconCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    uniqueUsersOrSessions: 'stackedBar'
  },
  perf: {
    beaconCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    uniqueUsersOrSessions: 'stackedBar',
    mobileColdStart: 'stackedArea'
  }
};
