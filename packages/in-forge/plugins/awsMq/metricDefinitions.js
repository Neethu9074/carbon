/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, millis } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'cpu_credit_balance',
      'current_connections_count',
      'journal_files_for_fast_recovery',
      'journal_files_for_full_recovery',
      'open_transactions_count',
      'total_consumer_count',
      'total_message_count',
      'total_producer_count',

      'broker2.cpu_credit_balance',
      'broker2.current_connections_count',
      'broker2.journal_files_for_fast_recovery',
      'broker2.journal_files_for_full_recovery',
      'broker2.open_transactions_count',
      'broker2.total_consumer_count',
      'broker2.total_message_count',
      'broker2.total_producer_count'
    ],
    labels: [
      'CpuCreditBalance',
      'CurrentConnectionsCount',
      'JournalFilesForFastRecovery',
      'JournalFilesForFullRecovery',
      'OpenTransactionsCount',
      'TotalConsumerCount',
      'TotalMessageCount',
      'TotalProducerCount',

      'CpuCreditBalance (2nd Broker)',
      'CurrentConnectionsCount (2nd Broker)',
      'JournalFilesForFastRecovery (2nd Broker)',
      'JournalFilesForFullRecovery (2nd Broker)',
      'OpenTransactionsCount (2nd Broker)',
      'TotalConsumerCount (2nd Broker)',
      'TotalMessageCount (2nd Broker)',
      'TotalProducerCount (2nd Broker)'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'consumer_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'enqueue_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'expired_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'dispatch_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'dequeue_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'producer_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics', 'queue_size', 'Queue'),

      getDynamicMetricMatch('queueMetrics2', 'consumer_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'enqueue_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'expired_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'dispatch_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'dequeue_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'producer_count', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'queue_size', 'Queue')
    ],
    labels: [
      'ConsumerCount',
      'EnqueueCount',
      'ExpiredCount',
      'DispatchCount',
      'DequeueCount',
      'ProducerCount',
      'QueueSize',

      'ConsumerCount(2nd Broker)',
      'EnqueueCount (2nd Broker)',
      'ExpiredCount (2nd Broker)',
      'DispatchCount (2nd Broker)',
      'DequeueCount (2nd Broker)',
      'ProducerCount (2nd Broker)',
      'QueueSize (2nd Broker)'
    ],
    category: ['Queues'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'consumer_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics', 'enqueue_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics', 'expired_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics', 'dispatch_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics', 'dequeue_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics', 'producer_count', 'Topic'),

      getDynamicMetricMatch('topicMetrics2', 'consumer_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'enqueue_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'expired_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'dispatch_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'dequeue_count', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'producer_count', 'Topic')
    ],
    labels: [
      'ConsumerCount',
      'EnqueueCount',
      'ExpiredCount',
      'DispatchCount',
      'DequeueCount',
      'ProducerCount',

      'ConsumerCount (2nd Broker)',
      'EnqueueCount (2nd Broker)',
      'ExpiredCount (2nd Broker)',
      'DispatchCount (2nd Broker)',
      'DequeueCount (2nd Broker)',
      'ProducerCount (2nd Broker)'
    ],
    category: ['Topics'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'cpu_utilization',
      'heap_usage',
      'store_percent_usage',

      'broker2.cpu_utilization',
      'broker2.heap_usage',
      'broker2.store_percent_usage'
    ],
    labels: [
      'CpuUtilization',
      'HeapUsage',
      'StorePercentUsage',

      'CpuUtilization (2nd Broker)',
      'HeapUsage (2nd Broker)',
      'StorePercentUsage (2nd Broker)'
    ],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'memory_usage', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'memory_usage', 'Queue')
    ],
    labels: ['MemoryUsage', 'MemoryUsage (2nd Broker)'],
    category: ['Queues'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'memory_usage', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'memory_usage', 'Topic')
    ],
    labels: ['MemoryUsage', 'MemoryUsage (2nd Broker)'],
    category: ['Topics'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'enqueue_time', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'enqueue_time', 'Queue')
    ],
    labels: ['EnqueueTime', 'EnqueueTime (2nd Broker)'],
    category: ['Queues'],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'enqueue_time', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'enqueue_time', 'Topic')
    ],
    labels: ['EnqueueTime', 'EnqueueTime (2nd Broker)'],
    category: ['Topics'],
    min: 0,
    formatter: millis
  }
];
