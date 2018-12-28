import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';
import { affectedUsers } from 'in-websites/formatters';

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
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

const uniqueUsers = {
  metric: 'uniqueUsers',
  label: 'Unique Users',
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
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
  resourceLoad: [newTimeMetric('beaconDuration', 'Retrieval Time'), uniqueUsers, ...resourceTimingMetrics],
  httpRequest: [newTimeMetric('beaconDuration', 'Retrieval Time'), uniqueUsers],
  error: [
    {
      ...uniqueUsers,
      // relabel the metric
      label: 'Affected Users'
    }
  ]
};

function newTimeMetric(metric, label, category) {
  return {
    metric,
    label,
    formatter: millis.forcedFixedCompact,
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedArea
  };
}
