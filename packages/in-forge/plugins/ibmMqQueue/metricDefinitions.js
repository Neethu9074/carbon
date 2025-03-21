/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, seconds, micros, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['maxQueueDepth', 'queueDepth'],
    labels: [t('in-forge:plugins.ibmMqQueue.maxQueueDepth'), t('in-forge:plugins.ibmMqQueue.currentQueueDepth')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.depth')],
    formatter: number
  },
  {
    metrics: ['queueFullPercentage'],
    labels: [t('in-forge:plugins.ibmMqQueue.queueFullPercentage')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.depth')],
    formatter: percentage
  },
  {
    metrics: ['messagesIn', 'messagesOut', 'uncommittedMessages'],
    labels: [
      t('in-forge:plugins.ibmMqQueue.messagesIn'),
      t('in-forge:plugins.ibmMqQueue.messagesOut'),
      t('in-forge:plugins.ibmMqQueue.uncommittedMessages')
    ],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.messages')],
    formatter: number
  },
  {
    metrics: ['triggerTypeStatus', 'triggerControlStatus', 'queueTypeStatus', 'queueUsageStatus'],
    labels: [
      t('in-forge:plugins.ibmMqQueue.triggerType'),
      t('in-forge:plugins.ibmMqQueue.triggerControl'),
      t('in-forge:plugins.ibmMqQueue.queueType'),
      t('in-forge:plugins.ibmMqQueue.queueUsage')
    ],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.attributes')],
    formatter: number
  },
  {
    metrics: ['oldestMessage'],
    labels: [t('in-forge:plugins.ibmMqQueue.oldestMessage')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.messageTime')],
    formatter: seconds
  },
  {
    metrics: ['onQueueMessageTime'],
    labels: [t('in-forge:plugins.ibmMqQueue.onQueueMessageTime')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.messageTime')],
    formatter: micros
  },
  {
    metrics: ['openInputCount', 'openOutputCount'],
    labels: [t('in-forge:plugins.ibmMqQueue.openInputCount'), t('in-forge:plugins.ibmMqQueue.openOutputCount')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.calls')],
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'statistics',
        'nonPersistentPutBytes',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'persistentPutBytes',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'putFailCount',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'put1FailCount',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'nonPersistentGetBytes',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'persistentGetBytes',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'getFailCount',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      ),
      getDynamicMetricMatch(
        'statistics',
        'expiredMsgCount',
        t('in-forge:plugins.ibmMqQueue.statisticsRecord'),
        'any',
        true
      )
    ],
    labels: [
      t('in-forge:plugins.ibmMqQueue.nonPersistentPutBytes'),
      t('in-forge:plugins.ibmMqQueue.persistentPutBytes'),
      t('in-forge:plugins.ibmMqQueue.putFailCount'),
      t('in-forge:plugins.ibmMqQueue.put1FailCount'),
      t('in-forge:plugins.ibmMqQueue.nonPersistentGetBytes'),
      t('in-forge:plugins.ibmMqQueue.persistentGetBytes'),
      t('in-forge:plugins.ibmMqQueue.getFailCount'),
      t('in-forge:plugins.ibmMqQueue.expiredMsgCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.statistics')],
    formatter: number
  }
];
