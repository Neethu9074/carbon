/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
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
    labels: [t('in-forge:plugins.ibmMqChannel.sent'), t('in-forge:plugins.ibmMqChannel.received')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqChannel.buffers')],
    formatter: number
  }
];
