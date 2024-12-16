/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['inboundTraffic', 'outboundTraffic'],
    labels: [
      t('in-forge:plugins.azureSignalR.labelInboundTraffic'),
      t('in-forge:plugins.azureSignalR.labelOutboundTraffic')
    ],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serverLoad', 'userErrors', 'systemErrors', 'connectionQuotaUtilization'],
    labels: [
      t('in-forge:plugins.azureSignalR.labelServerLoad'),
      t('in-forge:plugins.azureSignalR.labelUserErrors'),
      t('in-forge:plugins.azureSignalR.labelSystemErrors'),
      t('in-forge:plugins.azureSignalR.labelConnectionQuotaUtilization')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['connectionCount', 'messageCount', 'connectionOpenCount'],
    labels: [
      t('in-forge:plugins.azureSignalR.labelConnectionCount'),
      t('in-forge:plugins.azureSignalR.labelMessageCount'),
      t('in-forge:plugins.azureSignalR.labelConnectionOpenCount')
    ],
    formatter: number.compact,
    min: 0
  }
];
