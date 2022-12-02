/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, millis, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  // Common metrics for both engines
  {
    metrics: ['current_connections_count', 'total_message_count'],
    labels: [t('in-forge:plugins.awsMq.currentConnectionsCount'), t('in-forge:plugins.awsMq.totalMessageCount')],
    min: 0,
    formatter: number
  },
  // ActiveMQ
  {
    metrics: [
      'cpu_credit_balance',
      'journal_files_for_fast_recovery',
      'journal_files_for_full_recovery',
      'open_transactions_count',
      'total_consumer_count',
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
      t('in-forge:plugins.awsMq.journalFilesForFastRecovery'),
      t('in-forge:plugins.awsMq.journalFilesForFullRecovery'),
      t('in-forge:plugins.awsMq.openTransactionsCount'),
      t('in-forge:plugins.awsMq.totalConsumerCount'),
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
    category: [t('in-forge:plugins.awsMq.activeMq')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'consumer_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'enqueue_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'expired_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'dispatch_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'dequeue_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'producer_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'queue_size', t('in-forge:plugins.awsMq.queue')),

      getDynamicMetricMatch('queueMetrics2', 'consumer_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'enqueue_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'expired_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'dispatch_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'dequeue_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'producer_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'queue_size', t('in-forge:plugins.awsMq.queue'))
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
    category: [t('in-forge:plugins.awsMq.activeMqQueues')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'consumer_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics', 'enqueue_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics', 'expired_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics', 'dispatch_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics', 'dequeue_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics', 'producer_count', t('in-forge:plugins.awsMq.topic')),

      getDynamicMetricMatch('topicMetrics2', 'consumer_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'enqueue_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'expired_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'dispatch_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'dequeue_count', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'producer_count', t('in-forge:plugins.awsMq.topic'))
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
    category: [t('in-forge:plugins.awsMq.activeMqTopics')],
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
    category: [t('in-forge:plugins.awsMq.activeMq')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'memory_usage', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'memory_usage', t('in-forge:plugins.awsMq.queue'))
    ],
    labels: [t('in-forge:plugins.awsMq.memoryUsage'), t('in-forge:plugins.awsMq.memoryUsage2ndBroker')],
    category: [t('in-forge:plugins.awsMq.activeMqQueues')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'memory_usage', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'memory_usage', t('in-forge:plugins.awsMq.topic'))
    ],
    labels: [t('in-forge:plugins.awsMq.memoryUsage'), t('in-forge:plugins.awsMq.memoryUsage2ndBroker')],
    category: [t('in-forge:plugins.awsMq.activeMqTopics')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'enqueue_time', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics2', 'enqueue_time', t('in-forge:plugins.awsMq.queue'))
    ],
    labels: [t('in-forge:plugins.awsMq.enqueueTime'), t('in-forge:plugins.awsMq.enqueueTime2ndBroker')],
    category: [t('in-forge:plugins.awsMq.activeMqQueues')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('topicMetrics', 'enqueue_time', t('in-forge:plugins.awsMq.topic')),
      getDynamicMetricMatch('topicMetrics2', 'enqueue_time', t('in-forge:plugins.awsMq.topic'))
    ],
    labels: [t('in-forge:plugins.awsMq.enqueueTime'), t('in-forge:plugins.awsMq.enqueueTime2ndBroker')],
    category: [t('in-forge:plugins.awsMq.activeMqTopics')],
    min: 0,
    formatter: millis
  },

  // RabbitMQ
  {
    metrics: [
      'consumer_count',
      'messages_rate',
      'message_ready_count',
      'messages_ready_rate',
      'message_unacknowledged_count',
      'messages_unacknowledged_rate',
      'publish_rate',
      'confirm_rate',
      'ack_rate'
    ],
    labels: [
      t('in-forge:plugins.awsMq.consumerCount'),
      t('in-forge:plugins.awsMq.messageRate'),
      t('in-forge:plugins.awsMq.messageReadyCount'),
      t('in-forge:plugins.awsMq.messageReadyRate'),
      t('in-forge:plugins.awsMq.messageUnacknowledgedCount'),
      t('in-forge:plugins.awsMq.messageUnacknowledgedRate'),
      t('in-forge:plugins.awsMq.publishRate'),
      t('in-forge:plugins.awsMq.confirmRate'),
      t('in-forge:plugins.awsMq.ackRate')
    ],
    category: [t('in-forge:plugins.awsMq.rabbitMq')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodeMetrics', 'system_cpu_utilization', t('in-forge:plugins.awsMq.node')),
    labels: t('in-forge:plugins.awsMq.systemCpuUtilization'),
    category: [t('in-forge:plugins.awsMq.rabbitMqNodes')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('nodeMetrics', 'memory_limit', t('in-forge:plugins.awsMq.node')),
      getDynamicMetricMatch('nodeMetrics', 'memory_used', t('in-forge:plugins.awsMq.node')),
      getDynamicMetricMatch('nodeMetrics', 'disk_free_limit', t('in-forge:plugins.awsMq.node')),
      getDynamicMetricMatch('nodeMetrics', 'disk_free', t('in-forge:plugins.awsMq.node'))
    ],
    labels: [
      t('in-forge:plugins.awsMq.memoryLimit'),
      t('in-forge:plugins.awsMq.memoryUsed'),
      t('in-forge:plugins.awsMq.diskFreeLimit'),
      t('in-forge:plugins.awsMq.diskFree')
    ],
    category: [t('in-forge:plugins.awsMq.rabbitMqNodes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('nodeMetrics', 'file_descriptors_used', t('in-forge:plugins.awsMq.node')),
    labels: t('in-forge:plugins.awsMq.fileDescriptorsUsed'),
    category: [t('in-forge:plugins.awsMq.rabbitMqNodes')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queueMetrics', 'message_ready_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'message_unacknowledged_count', t('in-forge:plugins.awsMq.queue')),
      getDynamicMetricMatch('queueMetrics', 'message_count', t('in-forge:plugins.awsMq.queue'))
    ],
    labels: [
      t('in-forge:plugins.awsMq.messageReadyCount'),
      t('in-forge:plugins.awsMq.messageUnacknowledgedCount'),
      t('in-forge:plugins.awsMq.messageCount')
    ],
    category: [t('in-forge:plugins.awsMq.rabbitMqQueues')],
    min: 0,
    formatter: number
  }
];
