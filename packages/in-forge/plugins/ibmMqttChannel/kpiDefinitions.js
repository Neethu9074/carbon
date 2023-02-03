/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmMqttChannel.messagesSent'),
    metric: 'MQTTMessagesSent',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmMqttChannel.messagesReceived'),
    metric: 'MQTTMessagesReceived',
    formatter: number.compact
  }
];
