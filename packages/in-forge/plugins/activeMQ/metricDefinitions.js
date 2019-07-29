import { number, percentage } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'totalQueuesEnqueueCount',
      'totalQueuesDequeueCount',
      'totalTopicsDequeueCount',
      'totalTopicsEnqueueCount',
      'totalConnectionsCount',
      'totalConsumerCount',
      'totalProducerCount',
      getMetricMatch('topics', 'producerCount'),
      getMetricMatch('topics', 'consumerCount'),
      getMetricMatch('topics', 'enqueueCount'),
      getMetricMatch('topics', 'dequeueCount'),
      getMetricMatch('queues', 'enqueueCount'),
      getMetricMatch('queues', 'dequeueCount'),
      getMetricMatch('queues', 'queueSize'),
      getMetricMatch('dlqueues', 'enqueueCount'),
      getMetricMatch('dlqueues', 'dequeueCount'),
      getMetricMatch('dlqueues', 'queueSize')
    ],
    labels: [
      'All Queues Messages Enqueue',
      'All Queues Messages Dequeue',
      'All Topics Messages Dequeue',
      'All Topics Messages Enqueue',
      'Total Connections',
      'Total Consumers',
      'Total Producers',
      'Producer Count',
      'Consumer Count',
      'Messages Enqueued',
      'Messages Dequeued',
      'Messages Enqueued',
      'Messages Dequeued',
      'Queue Size',
      'Messages Enqueued',
      'Messages Dequeued',
      'Queue Size'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'memoryPercentUsage',
      'storePercentUsage',
      getMetricMatch('topics', 'memoryPercentUsage'),
      getMetricMatch('queues', 'memoryPercentUsage'),
      getMetricMatch('dlqueues', 'memoryPercentUsage')
    ],
    labels: ['Memory Usage', 'Store Usage'],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
