/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, meanLatency } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['ServerSendLatency'],
    labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelServerSendLatency')],
    formatter: meanLatency.detailed,
    min: 0
  },
  {
    metrics: [
      'SuccessfulRequests',
      'ServerErrors',
      'ThrottledRequests',
      'IncomingRequests',
      'IncomingMessages',
      'OutgoingMessages',
      'ActiveConnections',
      'ConnectionsOpened',
      'ConnectionsClosed',
      'DeadletteredMessages'
    ],
    labels: [
      t('in-forge:plugins.azureServiceBus.dashboard.labelSuccessfulRequests'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelServerErrors'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelThrottledRequests'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelIncomingRequests'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelIncomingMessages'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelOutgoingMessages'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelActiveConnections'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelConnectionsOpened'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelConnectionsClosed'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelDeadletteredMessages')
    ],
    formatter: number.compact,
    min: 0
  }
];
