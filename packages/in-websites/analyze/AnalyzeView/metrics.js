/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  newTimeMetric,
  newNumberMetric,
  newSizeMetric,
  withRawDataField,
  newNumberWithDecimalsMetric
} from 'in-analyze/metricDefinitionHelpers';
import { percentage, number, fourDecimalPlaces } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { affectedUsers } from 'in-websites/formatters';

export const clsFormatter = {
  compact: fourDecimalPlaces,
  detailed: fourDecimalPlaces
};

export const timestampMetricName = 'timestamp';
export const groupNameMetricName = 'name';
export const groupCountMetricName = 'count';

export function buildOrderByCriteria(metric, aggregation) {
  return `${metric}_${aggregation}_Agg`;
}

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  pageChange: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [
    { metric: 'beaconDuration', aggregation: 'MEAN' },
    { metric: 'beaconErrorRate', aggregation: 'MEAN' }
  ],
  error: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }],
  custom: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }]
};

const resourceTimingMetrics = [
  withRawDataField(newTimeMetric({ metric: 'redirectTime', label: 'Redirect Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.redirect'
  }),
  withRawDataField(newTimeMetric({ metric: 'appCacheTime', label: 'AppCache Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.appCache'
  }),
  withRawDataField(newTimeMetric({ metric: 'dnsTime', label: 'DNS Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.dns'
  }),
  withRawDataField(newTimeMetric({ metric: 'tcpTime', label: 'TCP Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.tcp'
  }),
  withRawDataField(newTimeMetric({ metric: 'sslTime', label: 'SSL Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.ssl'
  }),
  withRawDataField(newTimeMetric({ metric: 'requestTime', label: 'Request Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.request'
  }),
  withRawDataField(newTimeMetric({ metric: 'responseTime', label: 'Response Time', category: 'Resource Timing' }), {
    tag: 'beacon.timing.response'
  }),
  withRawDataField(newTimeMetric({ metric: 'ttfb', label: 'Time to First Byte', category: 'Resource Timing' }), {
    tag: 'beacon.timing.timeToFirstByte',
    rawDataField: 'backendTime'
  })
];

const resourceSizeMetrics = [
  withRawDataField(
    newSizeMetric({ metric: 'encodedBodySize', label: 'Encoded Body Size', category: 'Resource Sizing' }),
    {
      tag: 'beacon.http.encodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({ metric: 'decodedBodySize', label: 'Decoded Body Size', category: 'Resource Sizing' }),
    {
      tag: 'beacon.http.decodedBodySize'
    }
  ),
  withRawDataField(newSizeMetric({ metric: 'transferSize', label: 'Transfer Size', category: 'Resource Sizing' }), {
    tag: 'beacon.http.transferSize'
  })
];

const uniqueUsers = {
  category: 'User / Session Tracking',
  metric: 'uniqueUsers',
  label: 'Unique Users',
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const uniqueSessions = {
  category: 'User / Session Tracking',
  metric: 'uniqueSessions',
  label: 'Unique Sessions',
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const uniqueUsersOrSessions = {
  category: 'User / Session Tracking',
  metric: 'uniqueUsersOrSessions',
  label: 'Unique Users / Sessions',
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const errorRate = {
  metric: 'beaconErrorRate',
  label: 'Error Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  rawDataField: 'errorCount',
  rawDataLabel: 'Error Count',
  rawDataFormatter: number.compact,
  tag: 'beacon.error.count'
};

export const availableMetrics = {
  pageLoad: [
    newNumberMetric({ metric: 'pageLoads', label: 'Page Loads' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'onLoad Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,

    withRawDataField(newTimeMetric({ metric: 'unloadTime', label: 'Unload Time', category: 'Navigation Timing' }), {
      tag: 'beacon.timing.unload'
    }),
    // reassign the category
    ...resourceTimingMetrics.map(metric => ({
      ...metric,
      category: 'Navigation Timing'
    })),
    withRawDataField(
      newTimeMetric({ metric: 'processingTime', label: 'Processing Time', category: 'Navigation Timing' }),
      {
        tag: 'beacon.timing.processing'
      }
    ),
    withRawDataField(
      newTimeMetric({ metric: 'onLoadEventDuration', label: 'onLoad Event Time', category: 'Navigation Timing' }),
      {
        rawDataField: 'onLoadTime',
        tag: 'beacon.timing.onLoad'
      }
    ),
    withRawDataField(newTimeMetric({ metric: 'domTime', label: 'DOM Time', category: 'Navigation Timing' }), {
      tag: 'beacon.timing.dom'
    }),
    withRawDataField(newTimeMetric({ metric: 'childrenTime', label: 'Children Time', category: 'Navigation Timing' }), {
      tag: 'beacon.timing.children'
    }),
    withRawDataField(newTimeMetric({ metric: 'backendTime', label: 'Backend Time', category: 'Navigation Timing' }), {
      tag: 'beacon.timing.backend'
    }),
    withRawDataField(newTimeMetric({ metric: 'frontendTime', label: 'Frontend Time', category: 'Navigation Timing' }), {
      tag: 'beacon.timing.frontend'
    }),

    withRawDataField(newTimeMetric({ metric: 'firstPaintTime', label: 'First Paint', category: 'Paint Timing' }), {
      tag: 'beacon.timing.firstPaint'
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'firstContentfulPaintTime',
        label: 'First-Contentful Paint',
        category: 'Paint Timing'
      }),
      {
        tag: 'beacon.timing.firstContentfulPaint'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'largestContentfulPaintTime',
        label: 'Largest-Contentful Paint',
        category: 'Paint Timing'
      }),
      {
        tag: 'beacon.timing.largestContentfulPaint'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'firstInputDelay',
        label: 'First Input Delay'
      }),
      {
        tag: 'beacon.timing.firstInputDelay',
        rawDataField: 'firstInputDelayTime'
      }
    ),
    withRawDataField(
      newNumberWithDecimalsMetric({
        metric: 'cumulativeLayoutShift',
        label: 'Cumulative Layout Shift',
        formatter: clsFormatter
      }),
      {
        tag: 'beacon.cumulativeLayoutShift'
      }
    )
  ],
  pageChange: [
    newNumberMetric({ metric: 'pageTransitions', label: 'Page Transitions' }),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions
  ],
  resourceLoad: [
    newNumberMetric({ metric: 'beaconCount', label: 'Resource Loads' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  ],
  httpRequest: [
    newNumberMetric({ metric: 'beaconCount', label: 'Calls' }),
    newNumberMetric({ metric: 'beaconErrorCount', label: 'Erroneous Calls' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    errorRate,
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics,

    withRawDataField(newNumberMetric({ metric: 'http1xx', label: 'HTTP 1XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'beacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http2xx', label: 'HTTP 2XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'beacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http3xx', label: 'HTTP 3XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'beacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http4xx', label: 'HTTP 4XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'beacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http5xx', label: 'HTTP 5XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'beacon.http.status'
    }),

    withRawDataField(newNumberMetric({ metric: 'httpGet', label: 'HTTP GET Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'beacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPost', label: 'HTTP POST Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'beacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPut', label: 'HTTP PUT Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'beacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpDelete', label: 'HTTP DELETE Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'beacon.http.method'
    })
  ],
  error: [
    newNumberMetric({ metric: 'beaconCount', label: 'Occurrences' }),
    {
      ...uniqueUsers,
      // relabel the metric
      label: 'Affected Users'
    },
    {
      ...uniqueSessions,
      // relabel the metric
      label: 'Affected Sessions'
    },
    {
      ...uniqueUsersOrSessions,
      // relabel the metric
      label: 'Affected Users / Sessions'
    }
  ],
  custom: [
    newNumberMetric({ metric: 'beaconCount', label: 'Occurrences' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Duration' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions
  ]
};
