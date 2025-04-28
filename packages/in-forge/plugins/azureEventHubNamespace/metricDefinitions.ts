/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number, percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['incomingBytes', 'outgoingBytes'],
    labels: [
      t('in-forge:plugins.azureEventHubNamespace.labelIncomingBytes'),
      t('in-forge:plugins.azureEventHubNamespace.labelOutgoingBytes')
    ],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelTraffic')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['namespaceCpuUsage'],
    labels: [t('in-forge:plugins.azureEventHubNamespace.labelNamespaceCpuUsages')],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelCompute')],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['namespaceMemoryUsage'],
    labels: [t('in-forge:plugins.azureEventHubNamespace.labelNamespaceMemoryUsage')],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelCapacity')],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['replicationLagDuration'],
    labels: [t('in-forge:plugins.azureEventHubNamespace.labelReplicationLagDuration')],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelReplication')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['replicationLagCount'],
    labels: [t('in-forge:plugins.azureEventHubNamespace.labelReplicationLagCount')],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelReplication')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['serverErrors', 'userErrors'],
    labels: [
      t('in-forge:plugins.azureEventHubNamespace.labelServerErrors'),
      t('in-forge:plugins.azureEventHubNamespace.labelUserErrors')
    ],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelErrors')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['successfulRequests', 'throttledRequests', 'incomingRequests'],
    labels: [
      t('in-forge:plugins.azureEventHubNamespace.labelSuccessfulRequests'),
      t('in-forge:plugins.azureEventHubNamespace.labelThrottledRequests'),
      t('in-forge:plugins.azureEventHubNamespace.labelIncomingRequests')
    ],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelRequests')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['incomingMessages', 'outgoingMessages'],
    labels: [
      t('in-forge:plugins.azureEventHubNamespace.labelIncomingMessages'),
      t('in-forge:plugins.azureEventHubNamespace.labelOutgoingMessages')
    ],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelMessages')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['activeConnections', 'connectionsOpened', 'connectionsClosed'],
    labels: [
      t('in-forge:plugins.azureEventHubNamespace.labelActiveConnections'),
      t('in-forge:plugins.azureEventHubNamespace.labelConnectionsOpened'),
      t('in-forge:plugins.azureEventHubNamespace.labelConnectionsClosed')
    ],
    category: [t('in-forge:plugins.azureEventHubNamespace.labelConnections')],
    formatter: number.compact,
    min: 0
  }
];
