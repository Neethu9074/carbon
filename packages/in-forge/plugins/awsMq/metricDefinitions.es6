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
      getMetricMatch('queueMetrics', 'consumer_count'),
      getMetricMatch('queueMetrics', 'enqueue_count'),
      getMetricMatch('queueMetrics', 'expired_count'),
      getMetricMatch('queueMetrics', 'dispatch_count'),
      getMetricMatch('queueMetrics', 'dequeue_count'),
      getMetricMatch('queueMetrics', 'producer_count'),
      getMetricMatch('queueMetrics', 'queue_size'),
      getMetricMatch('topicMetrics', 'consumer_count'),
      getMetricMatch('topicMetrics', 'enqueue_count'),
      getMetricMatch('topicMetrics', 'expired_count'),
      getMetricMatch('topicMetrics', 'dispatch_count'),
      getMetricMatch('topicMetrics', 'dequeue_count'),
      getMetricMatch('topicMetrics', 'producer_count')
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
      'ConsumerCount (Queue)',
      'EnqueueCount (Queue)',
      'ExpiredCount (Queue)',
      'DispatchCount (Queue)',
      'DequeueCount (Queue)',
      'ProducerCount (Queue)',
      'QueueSize (Queue)',
      'ConsumerCount (Topic)',
      'EnqueueCount (Topic)',
      'ExpiredCount (Topic)',
      'DispatchCount (Topic)',
      'DequeueCount (Topic)',
      'ProducerCount (Topic)'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'cpu_utilization',
      'heap_usage',
      'store_percent_usage',
      getMetricMatch('queueMetrics', 'memory_usage'),
      getMetricMatch('topicMetrics', 'memory_usage')
    ],
    labels: ['CpuUtilization', 'HeapUsage', 'StorePercentUsage', 'MemoryUsage (Queue)', 'MemoryUsage (Topic)'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [getMetricMatch('queueMetrics', 'enqueue_time'), getMetricMatch('topicMetrics', 'enqueue_time')],
    labels: ['EnqueueTime (Queue)', 'EnqueueTime (Topic)'],
    min: 0,
    formatter: millis
  }
];
