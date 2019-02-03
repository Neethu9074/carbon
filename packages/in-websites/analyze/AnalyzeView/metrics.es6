import { newTimeMetric, newNumberMetric, newSizeMetric, withRawDataField } from 'in-analyze/metricDefinitionHelpers';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { affectedUsers } from 'in-websites/formatters';

export const timestampMetricName = 'timestamp';
export const groupNameMetricName = 'name';
export const groupCountMetricName = 'count';

export function buildOrderByCriteria(metric, aggregation) {
  return `${metric}_${aggregation}_Agg`;
}

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [{ metric: 'beaconDuration', aggregation: 'MEAN' }, { metric: 'beaconErrorRate', aggregation: 'MEAN' }],
  error: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }],
  custom: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }]
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
  metric: 'uniqueUsers',
  label: 'Unique Users',
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
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'onLoad Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    uniqueUsers,

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

    withRawDataField(newTimeMetric({ metric: 'firstPaintTime', label: 'First Paint Time', category: 'Paint Timing' }), {
      tag: 'beacon.timing.firstPaint'
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'firstContentfulPaintTime',
        label: 'First-Contentful Paint Time',
        category: 'Paint Timing'
      }),
      {
        tag: 'beacon.timing.firstContentfulPaint'
      }
    )
  ],
  resourceLoad: [
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    uniqueUsers,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  ],
  httpRequest: [
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration',
      tag: 'beacon.duration'
    }),
    errorRate,
    uniqueUsers,

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
    {
      ...uniqueUsers,
      // relabel the metric
      label: 'Affected Users'
    }
  ],
  custom: [uniqueUsers]
};
