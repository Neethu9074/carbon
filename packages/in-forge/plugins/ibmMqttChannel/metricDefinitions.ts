/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['channelStatusMetric'],
    labels: [t('in-forge:plugins.ibmMqttChannel.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connections'],
    labels: [t('in-forge:plugins.ibmMqttChannel.connections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['mqttMessagesSent', 'mqttMessagesReceived'],
    labels: [t('in-forge:plugins.ibmMqttChannel.messagesSent'), t('in-forge:plugins.ibmMqttChannel.messagesReceived')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqttChannel.messages')],
    formatter: number
  },
  {
    metrics: ['inDoubtInput', 'inDoubtOutput'],
    labels: [t('in-forge:plugins.ibmMqttChannel.inDoubtInput'), t('in-forge:plugins.ibmMqttChannel.inDoubtOutput')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqttChannel.indoubtMessages')],
    formatter: number
  },
  {
    metrics: ['pendingOutbound'],
    labels: [t('in-forge:plugins.ibmMqttChannel.pendingOutbound')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqttChannel.pendingOutbound')],
    formatter: number
  }
];
