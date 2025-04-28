/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number, percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['incomingBytes', 'outgoingBytes'],
    labels: [
      t('in-forge:plugins.azureEventHubCluster.labelIncomingBytes'),
      t('in-forge:plugins.azureEventHubCluster.labelOutgoingBytes')
    ],
    category: [t('in-forge:plugins.azureEventHubCluster.labelTraffic')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['cpu'],
    labels: [t('in-forge:plugins.azureEventHubCluster.labelCPU')],
    category: [t('in-forge:plugins.azureEventHubCluster.labelCompute')],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serverErrors', 'userErrors'],
    labels: [
      t('in-forge:plugins.azureEventHubCluster.labelServerErrors'),
      t('in-forge:plugins.azureEventHubCluster.labelUserErrors')
    ],
    category: [t('in-forge:plugins.azureEventHubCluster.labelErrors')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['successfulRequests', 'throttledRequests', 'incomingRequests'],
    labels: [
      t('in-forge:plugins.azureEventHubCluster.labelSuccessfulRequests'),
      t('in-forge:plugins.azureEventHubCluster.labelThrottledRequests'),
      t('in-forge:plugins.azureEventHubCluster.labelIncomingRequests')
    ],
    category: [t('in-forge:plugins.azureEventHubCluster.labelRequests')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['incomingMessages', 'outgoingMessages'],
    labels: [
      t('in-forge:plugins.azureEventHubCluster.labelIncomingMessages'),
      t('in-forge:plugins.azureEventHubCluster.labelOutgoingMessages')
    ],
    category: [t('in-forge:plugins.azureEventHubCluster.labelMessages')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['activeConnections', 'connectionsOpened', 'connectionsClosed'],
    labels: [
      t('in-forge:plugins.azureEventHubCluster.labelActiveConnections'),
      t('in-forge:plugins.azureEventHubCluster.labelConnectionsOpened'),
      t('in-forge:plugins.azureEventHubCluster.labelConnectionsClosed')
    ],
    category: [t('in-forge:plugins.azureEventHubCluster.labelConnections')],
    formatter: number.compact,
    min: 0
  }
];
