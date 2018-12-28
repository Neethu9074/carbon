import { newTimeMetric, newSizeMetric, newNumberMetric } from 'in-analyze/metricDefinitionHelpers';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';
import { affectedUsers } from 'in-websites/formatters';

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [{ metric: 'beaconDuration', aggregation: 'MEAN' }, { metric: 'beaconErrorRate', aggregation: 'MEAN' }],
  error: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }]
};

const resourceTimingMetrics = [
  newTimeMetric('redirectTime', 'Redirect Time', 'Resource Timing'),
  newTimeMetric('appCacheTime', 'AppCache Time', 'Resource Timing'),
  newTimeMetric('dnsTime', 'DNS Time', 'Resource Timing'),
  newTimeMetric('tcpTime', 'TCP Time', 'Resource Timing'),
  newTimeMetric('sslTime', 'SSL Time', 'Resource Timing'),
  newTimeMetric('requestTime', 'Request Time', 'Resource Timing'),
  newTimeMetric('responseTime', 'Response Time', 'Resource Timing')
];

const resourceSizeMetrics = [
  newSizeMetric('encodedBodySize', 'Encoded Body Size', 'Resource Sizing'),
  newSizeMetric('decodedBodySize', 'Decoded Body Size', 'Resource Sizing'),
  newSizeMetric('transferSize', 'Transfer Size', 'Resource Sizing')
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
  min: 0
};

export const availableMetrics = {
  pageLoad: [
    newTimeMetric('beaconDuration', 'onLoad Time'),
    uniqueUsers,

    newTimeMetric('unloadTime', 'Unload Time', 'Navigation Timing'),
    // reassign the category
    ...resourceTimingMetrics.map(metric => ({
      ...metric,
      category: 'Navigation Timing'
    })),
    newTimeMetric('processingTime', 'Processing Time', 'Navigation Timing'),
    newTimeMetric('onLoadEventDuration', 'onLoad Event Time', 'Navigation Timing'),
    newTimeMetric('domTime', 'DOM Time', 'Navigation Timing'),
    newTimeMetric('childrenTime', 'Children Time', 'Navigation Timing'),

    newTimeMetric('firstPaintTime', 'First Paint Time', 'Paint Timing'),
    newTimeMetric('firstContentfulPaintTime', 'First-Contentful Paint Time', 'Paint Timing')
  ],
  resourceLoad: [
    newTimeMetric('beaconDuration', 'Retrieval Time'),
    uniqueUsers,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  ],
  httpRequest: [
    newTimeMetric('beaconDuration', 'Retrieval Time'),
    errorRate,
    uniqueUsers,

    newNumberMetric('http1xx', 'HTTP 1XX Count', 'HTTP Status'),
    newNumberMetric('http2xx', 'HTTP 2XX Count', 'HTTP Status'),
    newNumberMetric('http3xx', 'HTTP 3XX Count', 'HTTP Status'),
    newNumberMetric('http4xx', 'HTTP 4XX Count', 'HTTP Status'),
    newNumberMetric('http5xx', 'HTTP 5XX Count', 'HTTP Status'),

    newNumberMetric('httpGet', 'HTTP GET Count', 'HTTP Method'),
    newNumberMetric('httpPost', 'HTTP POST Count', 'HTTP Method'),
    newNumberMetric('httpPut', 'HTTP PUT Count', 'HTTP Method'),
    newNumberMetric('httpDelete', 'HTTP DELETE Count', 'HTTP Method')
  ],
  error: [
    {
      ...uniqueUsers,
      // relabel the metric
      label: 'Affected Users'
    }
  ]
};
