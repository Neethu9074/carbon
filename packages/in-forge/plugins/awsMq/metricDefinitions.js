/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

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
      t('in-forge:plugins.awsMq.cpuCreditBalance'),
      t('in-forge:plugins.awsMq.currentConnectionsCount'),
      t('in-forge:plugins.awsMq.journalFilesForFastRecovery'),
      t('in-forge:plugins.awsMq.journalFilesForFullRecovery'),
      t('in-forge:plugins.awsMq.openTransactionsCount'),
      t('in-forge:plugins.awsMq.totalConsumerCount'),
      t('in-forge:plugins.awsMq.totalMessageCount'),
      t('in-forge:plugins.awsMq.totalProducerCount'),

      t('in-forge:plugins.awsMq.cpuCreditBalance2ndBroker'),
      t('in-forge:plugins.awsMq.currentConnectionsCount2ndBroker'),
      t('in-forge:plugins.awsMq.journalFilesForFastRecovery2ndBroker'),
      t('in-forge:plugins.awsMq.journalFilesForFullRecovery2ndBroker'),
      t('in-forge:plugins.awsMq.openTransactionsCount2ndBroker'),
      t('in-forge:plugins.awsMq.totalConsumerCount2ndBroker'),
      t('in-forge:plugins.awsMq.totalMessageCount2ndBroker'),
      t('in-forge:plugins.awsMq.totalProducerCount2ndBroker')
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
      t('in-forge:plugins.awsMq.consumerCount'),
      t('in-forge:plugins.awsMq.enqueueCount'),
      t('in-forge:plugins.awsMq.expiredCount'),
      t('in-forge:plugins.awsMq.dispatchCount'),
      t('in-forge:plugins.awsMq.DequeueCount'),
      t('in-forge:plugins.awsMq.producerCount'),
      t('in-forge:plugins.awsMq.queueSize'),

      t('in-forge:plugins.awsMq.consumerCount2ndBroker'),
      t('in-forge:plugins.awsMq.enqueueCount2ndBroker'),
      t('in-forge:plugins.awsMq.expiredCount2ndBroker'),
      t('in-forge:plugins.awsMq.dispatchCount2ndBroker'),
      t('in-forge:plugins.awsMq.dequeueCount2ndBroker'),
      t('in-forge:plugins.awsMq.producerCount2ndBroker'),
      t('in-forge:plugins.awsMq.queueSize2ndBroker')
    ],
    category: [t('in-forge:plugins.awsMq.queues')],
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
      t('in-forge:plugins.awsMq.consumerCount'),
      t('in-forge:plugins.awsMq.enqueueCount'),
      t('in-forge:plugins.awsMq.expiredCount'),
      t('in-forge:plugins.awsMq.dispatchCount'),
      t('in-forge:plugins.awsMq.dequeueCount'),
      t('in-forge:plugins.awsMq.producerCount'),

      t('in-forge:plugins.awsMq.consumerCount2ndBroker'),
      t('in-forge:plugins.awsMq.enqueueCount2ndBroker'),
      t('in-forge:plugins.awsMq.expiredCount2ndBroker'),
      t('in-forge:plugins.awsMq.dispatchCount2ndBroker'),
      t('in-forge:plugins.awsMq.dequeueCount2ndBroker'),
      t('in-forge:plugins.awsMq.producerCount2ndBroker')
    ],
    category: [t('in-forge:plugins.awsMq.topics')],
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
      t('in-forge:plugins.awsMq.cpuUtilization'),
      t('in-forge:plugins.awsMq.heapUsage'),
      t('in-forge:plugins.awsMq.storePercentUsage'),

      t('in-forge:plugins.awsMq.cpuUtilization2ndBroker'),
      t('in-forge:plugins.awsMq.heapUsage2ndBroker'),
      t('in-forge:plugins.awsMq.storePercentUsage2ndBroker')
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
    labels: [t('in-forge:plugins.awsMq.memoryUsage'), t('in-forge:plugins.awsMq.memoryUsage2ndBroker')],
    category: [t('in-forge:plugins.awsMq.queues')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'memory_usage', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'memory_usage', 'Topic')
    ],
    labels: [t('in-forge:plugins.awsMq.memoryUsage'), t('in-forge:plugins.awsMq.memoryUsage2ndBroker')],
    category: [t('in-forge:plugins.awsMq.topics')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'enqueue_time', 'Queue'),
      getDynamicMetricMatch('queueMetrics2', 'enqueue_time', 'Queue')
    ],
    labels: [t('in-forge:plugins.awsMq.enqueueTime'), t('in-forge:plugins.awsMq.enqueueTime2ndBroker')],
    category: [t('in-forge:plugins.awsMq.queues')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'enqueue_time', 'Topic'),
      getDynamicMetricMatch('topicMetrics2', 'enqueue_time', 'Topic')
    ],
    labels: [t('in-forge:plugins.awsMq.enqueueTime'), t('in-forge:plugins.awsMq.enqueueTime2ndBroker')],
    category: [t('in-forge:plugins.awsMq.topics')],
    min: 0,
    formatter: millis
  }
];
