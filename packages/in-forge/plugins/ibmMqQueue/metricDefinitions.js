/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds, micros } from 'in-services/formatters/number';
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
    metrics: ['lastResetTime'],
    labels: [t('in-forge:plugins.ibmMqQueue.lastResetTime')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.reset')],
    formatter: seconds
  },
  {
    metrics: ['openInputCount', 'openOutputCount'],
    labels: [t('in-forge:plugins.ibmMqQueue.openInputCount'), t('in-forge:plugins.ibmMqQueue.openOutputCount')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueue.calls')],
    formatter: number
  }
];
