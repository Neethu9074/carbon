/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['channelStatusMetric'],
    labels: [t('in-forge:plugins.ibmMqChannel.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['channelInDoubtMetric'],
    labels: [t('in-forge:plugins.ibmMqChannel.inDoubt')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['messagesSent', 'messagesAvailable'],
    labels: [t('in-forge:plugins.ibmMqChannel.sentReceived'), t('in-forge:plugins.ibmMqChannel.available')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqChannel.messages')],
    formatter: number
  },
  {
    metrics: ['sequenceNumberCurrent', 'sequenceNumberLast'],
    labels: [t('in-forge:plugins.ibmMqChannel.current'), t('in-forge:plugins.ibmMqChannel.last')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqChannel.sequenceNumber')],
    formatter: number
  },
  {
    metrics: ['buffersSent', 'buffersReceived'],
    labels: [t('in-forge:plugins.ibmMqChannel.buffersSent'), t('in-forge:plugins.ibmMqChannel.buffersReceived')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqChannel.buffers')],
    formatter: number
  },
  {
    metrics: ['bytesSent', 'bytesReceived'],
    labels: [t('in-forge:plugins.ibmMqChannel.bytesSent'), t('in-forge:plugins.ibmMqChannel.bytesReceived')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqChannel.buffers')],
    formatter: number
  }
];
