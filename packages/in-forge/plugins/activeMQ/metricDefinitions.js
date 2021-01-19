/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'totalQueuesEnqueueCount',
      'totalQueuesDequeueCount',
      'totalTopicsDequeueCount',
      'totalTopicsEnqueueCount',
      'totalConnectionsCount',
      'totalConsumerCount',
      'totalProducerCount'
    ],
    labels: [
      'All Queues Messages Enqueue',
      'All Queues Messages Dequeue',
      'All Topics Messages Dequeue',
      'All Topics Messages Enqueue',
      'Total Connections',
      'Total Consumers',
      'Total Producers'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('topics', 'producerCount', 'Topic'),
      getDynamicMetricMatch('topics', 'consumerCount', 'Topic'),
      getDynamicMetricMatch('topics', 'enqueueCount', 'Topic'),
      getDynamicMetricMatch('topics', 'dequeueCount', 'Topic')
    ],
    labels: ['Producer Count', 'Consumer Count', 'Messages Enqueued', 'Messages Dequeued'],
    category: ['Topics'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queues', 'enqueueCount', 'Queue'),
      getDynamicMetricMatch('queues', 'dequeueCount', 'Queue'),
      getDynamicMetricMatch('queues', 'queueSize', 'Queue')
    ],
    labels: ['Messages Enqueued', 'Messages Dequeued', 'Queue Size'],
    category: ['Queues'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('dlqueues', 'enqueueCount', 'DL Queue'),
      getDynamicMetricMatch('dlqueues', 'dequeueCount', 'DL Queue'),
      getDynamicMetricMatch('dlqueues', 'queueSize', 'DL Queue')
    ],
    labels: ['Messages Enqueued', 'Messages Dequeued', 'Queue Size'],
    category: ['DL Queues'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['memoryPercentage', 'storePercentage'],
    labels: ['Memory Usage', 'Store Usage'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('topics', 'memoryPercentage', 'Topic'),
    labels: 'Memory Usage',
    category: ['Topics'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('queues', 'memoryPercentage', 'Queue'),
    label: 'Memory Usage',
    category: ['Queues'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('dlqueues', 'memoryPercentage', 'DL Queue'),
    label: 'Memory Usage',
    category: ['DL Queues'],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
