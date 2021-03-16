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
    uniqueUsers: 'stackedBar'
  },
  viewChange: {
    beaconCount: 'stackedBar',
    views: 'stackedBar',
    uniqueUsers: 'stackedBar'
  },
  httpRequest: {
    beaconCount: 'stackedBar',
    beaconErrorCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    beaconErrorRate: 'stackedBar',
    uniqueUsers: 'stackedBar',
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
    uniqueUsers: 'stackedBar'
  }
};
