/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['latency'],
    labels: [t('in-forge:plugins.awsAppSync.labelLatency')],
    category: [t('in-forge:plugins.awsAppSync.category.network')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['publish_data_message_size'],
    labels: [t('in-forge:plugins.awsAppSync.labelPublishDataMessageSize')],
    category: [t('in-forge:plugins.awsAppSync.category.publishData')],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['connection_duration'],
    labels: [t('in-forge:plugins.awsAppSync.labelConnectionDuration')],
    category: [t('in-forge:plugins.awsAppSync.category.connections')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['4xx_error', '5xx_error', 'total_errors', 'requests', 'tokens_consumed'],
    labels: [
      t('in-forge:plugins.awsAppSync.label4xxError'),
      t('in-forge:plugins.awsAppSync.label5xxError'),
      t('in-forge:plugins.awsAppSync.labelTotalErrors'),
      t('in-forge:plugins.awsAppSync.labelRequests'),
      t('in-forge:plugins.awsAppSync.labelTokensConsumed')
    ],
    category: [t('in-forge:plugins.awsAppSync.category.network')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['connect_success', 'connect_client_error', 'connect_server_error', 'active_connections'],
    labels: [
      t('in-forge:plugins.awsAppSync.labelConnectSuccess'),
      t('in-forge:plugins.awsAppSync.labelConnectClientError'),
      t('in-forge:plugins.awsAppSync.labelConnectServerError'),
      t('in-forge:plugins.awsAppSync.labelActiveConnections')
    ],
    category: [t('in-forge:plugins.awsAppSync.category.connections')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['subscribe_success', 'subscribe_client_error', 'subscribe_server_error', 'active_subscriptions'],
    labels: [
      t('in-forge:plugins.awsAppSync.labelSubscribeSuccess'),
      t('in-forge:plugins.awsAppSync.labelSubscribeClientError'),
      t('in-forge:plugins.awsAppSync.labelSubscribeServerError'),
      t('in-forge:plugins.awsAppSync.labelActiveSubscriptions')
    ],
    category: [t('in-forge:plugins.awsAppSync.category.subscriptions')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['publish_data_message_success', 'publish_data_message_client_error', 'publish_data_message_server_error'],
    labels: [
      t('in-forge:plugins.awsAppSync.labelPublishDataMessageSuccess'),
      t('in-forge:plugins.awsAppSync.labelPublishDataMessageClientError'),
      t('in-forge:plugins.awsAppSync.labelPublishDataMessageServerError')
    ],
    category: [t('in-forge:plugins.awsAppSync.category.publishData')],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];
