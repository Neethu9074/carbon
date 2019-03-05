import { number, percentage, millis } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
      'broker2.total_producer_count',

      getMetricMatch('queueMetrics', 'consumer_count'),
      getMetricMatch('queueMetrics', 'enqueue_count'),
      getMetricMatch('queueMetrics', 'expired_count'),
      getMetricMatch('queueMetrics', 'dispatch_count'),
      getMetricMatch('queueMetrics', 'dequeue_count'),
      getMetricMatch('queueMetrics', 'producer_count'),
      getMetricMatch('queueMetrics', 'queue_size'),

      getMetricMatch('queueMetrics2', 'consumer_count'),
      getMetricMatch('queueMetrics2', 'enqueue_count'),
      getMetricMatch('queueMetrics2', 'expired_count'),
      getMetricMatch('queueMetrics2', 'dispatch_count'),
      getMetricMatch('queueMetrics2', 'dequeue_count'),
      getMetricMatch('queueMetrics2', 'producer_count'),
      getMetricMatch('queueMetrics2', 'queue_size'),

      getMetricMatch('topicMetrics', 'consumer_count'),
      getMetricMatch('topicMetrics', 'enqueue_count'),
      getMetricMatch('topicMetrics', 'expired_count'),
      getMetricMatch('topicMetrics', 'dispatch_count'),
      getMetricMatch('topicMetrics', 'dequeue_count'),
      getMetricMatch('topicMetrics', 'producer_count'),

      getMetricMatch('topicMetrics2', 'consumer_count'),
      getMetricMatch('topicMetrics2', 'enqueue_count'),
      getMetricMatch('topicMetrics2', 'expired_count'),
      getMetricMatch('topicMetrics2', 'dispatch_count'),
      getMetricMatch('topicMetrics2', 'dequeue_count'),
      getMetricMatch('topicMetrics2', 'producer_count')
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

      'CpuCreditBalance-2',
      'CurrentConnectionsCount-2',
      'JournalFilesForFastRecovery-2',
      'JournalFilesForFullRecovery-2',
      'OpenTransactionsCount-2',
      'TotalConsumerCount-2',
      'TotalMessageCount-2',
      'TotalProducerCount-2',

      'ConsumerCount (Queue)',
      'EnqueueCount (Queue)',
      'ExpiredCount (Queue)',
      'DispatchCount (Queue)',
      'DequeueCount (Queue)',
      'ProducerCount (Queue)',
      'QueueSize (Queue)',

      'ConsumerCount-2 (Queue)',
      'EnqueueCount-2 (Queue)',
      'ExpiredCount-2 (Queue)',
      'DispatchCount-2 (Queue)',
      'DequeueCount-2 (Queue)',
      'ProducerCount-2 (Queue)',
      'QueueSize-2 (Queue)',

      'ConsumerCount (Topic)',
      'EnqueueCount (Topic)',
      'ExpiredCount (Topic)',
      'DispatchCount (Topic)',
      'DequeueCount (Topic)',
      'ProducerCount (Topic)',

      'ConsumerCount-2 (Topic)',
      'EnqueueCount-2 (Topic)',
      'ExpiredCount-2 (Topic)',
      'DispatchCount-2 (Topic)',
      'DequeueCount-2 (Topic)',
      'ProducerCount-2 (Topic)'
    ],
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
      'broker2.store_percent_usage',

      getMetricMatch('queueMetrics', 'memory_usage'),
      getMetricMatch('queueMetrics2', 'memory_usage'),

      getMetricMatch('topicMetrics', 'memory_usage'),
      getMetricMatch('topicMetrics2', 'memory_usage')
    ],
    labels: [
      'CpuUtilization',
      'HeapUsage',
      'StorePercentUsage',

      'CpuUtilization-2',
      'HeapUsage-2',
      'StorePercentUsage-2',

      'MemoryUsage (Queue)',
      'MemoryUsage-2 (Queue)',
      'MemoryUsage (Topic)',
      'MemoryUsage-2 (Topic)'
    ],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getMetricMatch('queueMetrics', 'enqueue_time'),
      getMetricMatch('queueMetrics2', 'enqueue_time'),
      getMetricMatch('topicMetrics', 'enqueue_time'),
      getMetricMatch('topicMetrics2', 'enqueue_time')
    ],
    labels: ['EnqueueTime (Queue)', 'EnqueueTime-2 (Queue)', 'EnqueueTime (Topic)', 'EnqueueTime-2 (Topic)'],
    min: 0,
    formatter: millis
  }
];
