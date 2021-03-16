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
      getDynamicMetricMatch('topics', 'producerCount', 'Topic'),
      getDynamicMetricMatch('topics', 'consumerCount', 'Topic'),
      getDynamicMetricMatch('topics', 'enqueueCount', 'Topic'),
      getDynamicMetricMatch('topics', 'dequeueCount', 'Topic')
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
      getDynamicMetricMatch('queues', 'enqueueCount', 'Queue'),
      getDynamicMetricMatch('queues', 'dequeueCount', 'Queue'),
      getDynamicMetricMatch('queues', 'queueSize', 'Queue')
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
      getDynamicMetricMatch('dlqueues', 'enqueueCount', 'DL Queue'),
      getDynamicMetricMatch('dlqueues', 'dequeueCount', 'DL Queue'),
      getDynamicMetricMatch('dlqueues', 'queueSize', 'DL Queue')
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
    metric: getDynamicMetricMatch('topics', 'memoryPercentage', 'Topic'),
    labels: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.topics')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('queues', 'memoryPercentage', 'Queue'),
    label: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.queues')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('dlqueues', 'memoryPercentage', 'DL Queue'),
    label: t('in-forge:plugins.activeMQ.memoryUsage'),
    category: [t('in-forge:plugins.activeMQ.dlQueues')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
