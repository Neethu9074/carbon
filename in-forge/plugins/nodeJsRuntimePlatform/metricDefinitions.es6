import {
  millis,
  number,
  bytes
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


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
    metrics: [
      'activeHandles',
      'activeRequests'
    ],
    labels: [
      '#Handles',
      '#Requests'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'gc.minorGcs',
      'gc.majorGcs'
    ],
    labels: [
      '#Minor GCs',
      '#Major GCs'
    ],
    min: 0,
    category: ['GC'],
    formatter: bytes,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metrics: [
      'memory.rss',
      'memory.heapUsed',
      'gc.usedHeapSizeAfterGc'
    ],
    labels: [
      'RSS',
      'Heap Size',
      'Heap Size After GC'
    ],
    min: 0,
    category: ['GC'],
    formatter: number,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'gc.statsSupported'], false);
    }
  },
  {
    metrics: [
      'memory.rss',
      'memory.heapUsed'
    ],
    labels: [
      'RSS',
      'Heap Size'
    ],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: [
      'libuv.max',
      'libuv.sum',
      'libuv.lag'
    ],
    labels: [
      'Longest time spent in a single loop',
      'Total time spent in loop',
      'Event loop lag'
    ],
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
    metric: getMetricMatch('heapSpaces', 'available'),
    label: 'Available',
    min: 0,
    category: ['Heap Space'],
    formatter: bytes
  },
  {
    metric: getMetricMatch('heapSpaces', 'current'),
    label: 'Current',
    min: 0,
    category: ['Heap Space'],
    formatter: bytes
  },
  {
    metric: getMetricMatch('heapSpaces', 'used'),
    label: 'Used',
    min: 0,
    category: ['Heap Space'],
    formatter: bytes
  },
  {
    metric: getMetricMatch('heapSpaces', 'physical'),
    label: 'Physical',
    min: 0,
    category: ['Heap Space'],
    formatter: bytes
  },
  {
    metric: getMetricMatch('http', 'requests'),
    label: 'Requests / s',
    min: 0,
    category: ['Http'],
    formatter: number
  },
  {
    metric: getMetricMatch('http', 'responses'),
    label: 'Responses / s',
    min: 0,
    category: ['Http'],
    formatter: number
  },
  {
    metric: getMetricMatch('http', 'responseTime50'),
    label: 'Response Time 50th',
    min: 0,
    category: ['Http'],
    formatter: millis
  },
  {
    metric: getMetricMatch('http', 'responseTime90'),
    label: 'Response Time 90th',
    min: 0,
    category: ['Http'],
    formatter: millis
  },
  {
    metric: getMetricMatch('http', 'responseTime95'),
    label: 'Response Time 95th',
    min: 0,
    category: ['Http'],
    formatter: millis
  },
  {
    metric: getMetricMatch('http', 'responseTime99'),
    label: 'Response Time 99th',
    min: 0,
    category: ['Http'],
    formatter: millis
  }
];
