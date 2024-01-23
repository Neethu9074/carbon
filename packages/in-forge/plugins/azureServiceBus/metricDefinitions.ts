/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['serverSendLatency'],
    labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelServerSendLatency')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: [
      'successfulRequests',
      'serverErrors',
      'throttledRequests',
      'incomingRequests',
      'incomingMessages',
      'outgoingMessages',
      'activeConnections',
      'connectionsOpened',
      'connectionsClosed',
      'deadletteredMessages'
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
