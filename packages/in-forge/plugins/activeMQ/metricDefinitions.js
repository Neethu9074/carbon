/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
      t('in-forge:plugins.activeMQ.allQueuesMessagesEnqueue'),
      t('in-forge:plugins.activeMQ.allQueuesMessagesDequeue'),
      t('in-forge:plugins.activeMQ.allTopicsMessagesDequeue'),
      t('in-forge:plugins.activeMQ.allTopicsMessagesEnqueue'),
      t('in-forge:plugins.activeMQ.totalConnections'),
      t('in-forge:plugins.activeMQ.totalConsumers'),
      t('in-forge:plugins.activeMQ.totalProducers')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('topics', 'producerCount', t('in-forge:plugins.activeMQ.topic')),
      getDynamicMetricMatch('topics', 'consumerCount', t('in-forge:plugins.activeMQ.topic')),
      getDynamicMetricMatch('topics', 'enqueueCount', t('in-forge:plugins.activeMQ.topic')),
      getDynamicMetricMatch('topics', 'dequeueCount', t('in-forge:plugins.activeMQ.topic'))
    ],
    labels: [
      t('in-forge:plugins.activeMQ.producerCount'),
      t('in-forge:plugins.activeMQ.consumerCount'),
      t('in-forge:plugins.activeMQ.messagesEnqueued'),
      t('in-forge:plugins.activeMQ.messagesDequeued')
    ],
    category: [t('in-forge:plugins.activeMQ.topics')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queues', 'enqueueCount', t('in-forge:plugins.activeMQ.queue')),
      getDynamicMetricMatch('queues', 'dequeueCount', t('in-forge:plugins.activeMQ.queue')),
      getDynamicMetricMatch('queues', 'queueSize', t('in-forge:plugins.activeMQ.queue'))
    ],
    labels: [
      t('in-forge:plugins.activeMQ.messagesEnqueued'),
      t('in-forge:plugins.activeMQ.messagesDequeued'),
      t('in-forge:plugins.activeMQ.queueSize')
    ],
    category: [t('in-forge:plugins.activeMQ.queues')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('dlqueues', 'enqueueCount', t('in-forge:plugins.activeMQ.dlQueue')),
      getDynamicMetricMatch('dlqueues', 'dequeueCount', t('in-forge:plugins.activeMQ.dlQueue')),
      getDynamicMetricMatch('dlqueues', 'queueSize', t('in-forge:plugins.activeMQ.dlQueue'))
    ],
    labels: [
      t('in-forge:plugins.activeMQ.messagesEnqueued'),
      t('in-forge:plugins.activeMQ.messagesDequeued'),
      t('in-forge:plugins.activeMQ.queueSize')
    ],
    category: [t('in-forge:plugins.activeMQ.dlQueues')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['memoryPercentage', 'storePercentage'],
    labels: [t('in-forge:plugins.activeMQ.memoryUsage'), t('in-forge:plugins.activeMQ.storeUsage')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('topics', 'memoryPercentage', t('in-forge:plugins.activeMQ.topic')),
    labels: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.topics')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('queues', 'memoryPercentage', t('in-forge:plugins.activeMQ.queue')),
    label: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.queues')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('dlqueues', 'memoryPercentage', t('in-forge:plugins.activeMQ.dlQueue')),
    label: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.dlQueues')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
