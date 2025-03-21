/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['statusMetric'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['chInitStatus'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.channelInitiatorStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pubsubStatus'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.pubsubStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connectionCount'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.connections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['messagesIn'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.messagesIn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['messagesOut'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.messagesOut')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['uncommittedMessages'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.uncommittedMessages')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['clusterStatusMetric'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.clusterStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['clusterSuspendIndicatorStatus'],
    labels: [t('in-forge:plugins.ibmMqQueueManager.clusterSuspendIndicator')],
    min: 0,
    formatter: number
  }
];
