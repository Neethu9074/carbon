/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const resourceTimingMetrics = {
  redirectTime: 'stackedArea',
  appCacheTime: 'stackedArea',
  dnsTime: 'stackedArea',
  tcpTime: 'stackedArea',
  sslTime: 'stackedArea',
  requestTime: 'stackedArea',
  responseTime: 'stackedArea',
  ttfb: 'stackedArea'
};

const resourceSizeMetrics = {
  encodedBodySize: 'stackedArea',
  decodedBodySize: 'stackedArea',
  transferSize: 'stackedArea'
};

const uniqueMetrics = {
  uniqueUsers: 'stackedBar',
  uniqueSessions: 'stackedBar',
  uniqueUsersOrSessions: 'stackedBar'
};

export const metricRenderers = {
  pageLoad: {
    beaconCount: 'stackedBar',
    beaconErrorCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    onLoadTime: 'stackedArea',
    pageLoads: 'stackedBar',
    ...uniqueMetrics,
    unloadTime: 'stackedArea',
    ...resourceTimingMetrics,
    processingTime: 'stackedArea',
    onLoadEventDuration: 'stackedArea',
    domTime: 'stackedArea',
    childrenTime: 'stackedArea',
    backendTime: 'stackedArea',
    frontendTime: 'stackedArea',
    firstPaintTime: 'stackedArea',
    firstContentfulPaintTime: 'stackedArea',
    largestContentfulPaintTime: 'stackedArea',
    firstInputDelay: 'stackedArea',
    cumulativeLayoutShift: 'stackedBar'
  },
  pageChange: {
    beaconCount: 'stackedBar',
    pageTransitions: 'stackedBar',
    ...uniqueMetrics
  },
  resourceLoad: {
    beaconCount: 'stackedBar',
    beaconErrorCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    ...uniqueMetrics,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  },
  httpRequest: {
    beaconCount: 'stackedBar',
    beaconErrorCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    beaconErrorRate: 'stackedBar',
    ...uniqueMetrics,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics,
    http1xx: 'stackedBar',
    http2xx: 'stackedBar',
    http3xx: 'stackedBar',
    http4xx: 'stackedBar',
    http5xx: 'stackedBar',
    httpxxx: 'stackedBar',
    httpGet: 'stackedBar',
    httpPost: 'stackedBar',
    httpPut: 'stackedBar',
    httpDelete: 'stackedBar'
  },
  error: {
    beaconCount: 'stackedBar',
    errors: 'stackedBar',
    ...uniqueMetrics
  },
  custom: {
    beaconCount: 'stackedBar',
    beaconDuration: 'stackedArea',
    ...uniqueMetrics
  }
};
