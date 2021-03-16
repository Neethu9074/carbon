/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const TOPICS_ROOT = 'topics';
const QUEUES_ROOT = 'queues';

const placeholderTopic = t('in-forge:plugins.tibcoEMS.labelTopic');
const placeholderQueue = t('in-forge:plugins.tibcoEMS.labelQueue');

export default [
  {
    metrics: [
      'uptime',
      'connectionCount',
      'sessionCount',
      'durableCount',
      'readOperations',
      'writeOperations',
      'pendingMessageCount',
      'pendingMessageSize',
      'messagesMemory',
      'inMessages',
      'inMessagesCount',
      'outMessages',
      'outMessagesCount'
    ],
    labels: [
      t('in-forge:plugins.tibcoEMS.labelUpTime'),
      t('in-forge:plugins.tibcoEMS.labelConnectionsCount'),
      t('in-forge:plugins.tibcoEMS.labelSessionsCount'),
      t('in-forge:plugins.tibcoEMS.labelDurablesCount'),
      t('in-forge:plugins.tibcoEMS.labelReadOperationsRate'),
      t('in-forge:plugins.tibcoEMS.labelWriteOperationsRate'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesSize'),
      t('in-forge:plugins.tibcoEMS.titleMessagesMemory'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesRate')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessages', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessagesCount', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessagesSize', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessages', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessagesCount', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessagesSize', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessages', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessagesSize', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessagesLimit', placeholderTopic),
      getDynamicMetricMatch(TOPICS_ROOT, 'subscriberCount', placeholderTopic)
    ],
    labels: [
      t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesLimit'),
      t('in-forge:plugins.tibcoEMS.labelSubscribersCount')
    ],
    category: [t('in-forge:plugins.tibcoEMS.categoryTopics')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessages', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessagesCount', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessagesSize', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessages', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessagesCount', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessagesSize', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesCount', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesSize', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesLimit', placeholderQueue),
      getDynamicMetricMatch(QUEUES_ROOT, 'receiverCount', placeholderQueue)
    ],
    labels: [
      t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesLimit'),
      t('in-forge:plugins.tibcoEMS.labelReceiversCount')
    ],
    category: [t('in-forge:plugins.tibcoEMS.categoryQueues')],
    min: 0,
    formatter: number
  }
];
