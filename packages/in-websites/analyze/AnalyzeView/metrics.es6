import { newTimeMetric, newNumberMetric, newSizeMetric, withRawDataField } from 'in-analyze/metricDefinitionHelpers';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { identity } from 'in-services/formatters/string';
import { affectedUsers } from 'in-websites/formatters';

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [{ metric: 'beaconDuration', aggregation: 'MEAN' }, { metric: 'beaconErrorRate', aggregation: 'MEAN' }],
  error: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }]
};

const resourceTimingMetrics = [
  withRawDataField(newTimeMetric({ metric: 'redirectTime', label: 'Redirect Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'appCacheTime', label: 'AppCache Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'dnsTime', label: 'DNS Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'tcpTime', label: 'TCP Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'sslTime', label: 'SSL Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'requestTime', label: 'Request Time', category: 'Resource Timing' })),
  withRawDataField(newTimeMetric({ metric: 'responseTime', label: 'Response Time', category: 'Resource Timing' }))
];

const resourceSizeMetrics = [
  withRawDataField(
    newSizeMetric({ metric: 'encodedBodySize', label: 'Encoded Body Size', category: 'Resource Sizing' })
  ),
  withRawDataField(
    newSizeMetric({ metric: 'decodedBodySize', label: 'Decoded Body Size', category: 'Resource Sizing' })
  ),
  withRawDataField(newSizeMetric({ metric: 'transferSize', label: 'Transfer Size', category: 'Resource Sizing' }))
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
  rawDataFormatter: number.forcedCompact
};

export const availableMetrics = {
  pageLoad: [
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'onLoad Time' }), {
      rawDataField: 'duration'
    }),
    uniqueUsers,

    withRawDataField(newTimeMetric({ metric: 'unloadTime', label: 'Unload Time', category: 'Navigation Timing' })),
    // reassign the category
    ...resourceTimingMetrics.map(metric => ({
      ...metric,
      category: 'Navigation Timing'
    })),
    withRawDataField(
      newTimeMetric({ metric: 'processingTime', label: 'Processing Time', category: 'Navigation Timing' })
    ),
    withRawDataField(
      newTimeMetric({ metric: 'onLoadEventDuration', label: 'onLoad Event Time', category: 'Navigation Timing' }),
      {
        rawDataField: 'onLoadTime'
      }
    ),
    withRawDataField(newTimeMetric({ metric: 'domTime', label: 'DOM Time', category: 'Navigation Timing' })),
    withRawDataField(newTimeMetric({ metric: 'childrenTime', label: 'Children Time', category: 'Navigation Timing' })),

    withRawDataField(newTimeMetric({ metric: 'firstPaintTime', label: 'First Paint Time', category: 'Paint Timing' })),
    withRawDataField(
      newTimeMetric({
        metric: 'firstContentfulPaintTime',
        label: 'First-Contentful Paint Time',
        category: 'Paint Timing'
      })
    )
  ],
  resourceLoad: [
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration'
    }),
    uniqueUsers,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  ],
  httpRequest: [
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration'
    }),
    errorRate,
    uniqueUsers,

    withRawDataField(newNumberMetric({ metric: 'http1xx', label: 'HTTP 1XX Count', category: 'HTTP Status' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'http2xx', label: 'HTTP 2XX Count', category: 'HTTP Status' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'http3xx', label: 'HTTP 3XX Count', category: 'HTTP Status' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'http4xx', label: 'HTTP 4XX Count', category: 'HTTP Status' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'http5xx', label: 'HTTP 5XX Count', category: 'HTTP Status' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      rawDataFormatter: identity
    }),

    withRawDataField(newNumberMetric({ metric: 'httpGet', label: 'HTTP GET Count', category: 'HTTP Method' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPost', label: 'HTTP POST Count', category: 'HTTP Method' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPut', label: 'HTTP PUT Count', category: 'HTTP Method' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      rawDataFormatter: identity
    }),
    withRawDataField(newNumberMetric({ metric: 'httpDelete', label: 'HTTP DELETE Count', category: 'HTTP Method' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      rawDataFormatter: identity
    })
  ],
  error: [
    {
      ...uniqueUsers,
      // relabel the metric
      label: 'Affected Users'
    }
  ]
};
