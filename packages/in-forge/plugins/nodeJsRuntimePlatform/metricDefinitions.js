import { health, millis, number, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: 'gc.gcPause',
    label: 'GC Pause',
    min: 0,
    category: ['GC Activity'],
    formatter: millis,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metrics: ['activeHandles', 'activeRequests'],
    labels: ['#Handles', '#Requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['gc.minorGcs', 'gc.majorGcs'],
    labels: ['#Minor GCs', '#Major GCs'],
    min: 0,
    category: ['GC'],
    formatter: bytes,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metrics: ['memory.rss', 'memory.heapUsed', 'gc.usedHeapSizeAfterGc'],
    labels: ['RSS', 'Heap Size', 'Heap Size After GC'],
    min: 0,
    category: ['GC'],
    formatter: number,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metrics: ['memory.rss', 'memory.heapUsed'],
    labels: ['RSS', 'Heap Size'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['libuv.max', 'libuv.sum', 'libuv.lag'],
    labels: ['Longest time spent in a single loop', 'Total time spent in loop', 'Event loop lag'],
    min: 0,
    category: ['Event Loop'],
    formatter: millis,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metric: 'libuv.num',
    label: 'Loops per second',
    min: 0,
    category: ['Event Loop'],
    formatter: number,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'available', 'Heap Space'),
    label: 'Available',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'current', 'Heap Space'),
    label: 'Current',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'used', 'Heap Space'),
    label: 'Used',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'physical', 'Heap Space'),
    label: 'Physical',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('http', 'requests', 'Http Server Key'),
    label: 'Requests / s',
    min: 0,
    category: ['HTTP Servers'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('http', 'responses', 'Http Server Key'),
    label: 'Responses / s',
    min: 0,
    category: ['HTTP Servers'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('http', 'responseTime50', 'Http Server Key'),
    label: 'Response Time 50th',
    min: 0,
    category: ['HTTP Servers'],
    formatter: millis,
    isPercentile: true
  },
  {
    metric: getDynamicMetricMatch('http', 'responseTime90', 'Http Server Key'),
    label: 'Response Time 90th',
    min: 0,
    category: ['HTTP Servers'],
    formatter: millis,
    isPercentile: true
  },
  {
    metric: getDynamicMetricMatch('http', 'responseTime95', 'Http Server Key'),
    label: 'Response Time 95th',
    min: 0,
    category: ['HTTP Servers'],
    formatter: millis,
    isPercentile: true
  },
  {
    metric: getDynamicMetricMatch('http', 'responseTime99', 'Http Server Key'),
    label: 'Response Time 99th',
    min: 0,
    category: ['HTTP Servers'],
    formatter: millis,
    isPercentile: true
  },
  {
    metric: 'healthcheckResult',
    label: 'Health check result',
    min: 0,
    max: 1.1,
    category: ['Health'],
    formatter: health
  }
];
