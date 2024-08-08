/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { meanLatency, bytes, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['currentConnections'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelCurrentConnections')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelConnections')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['applicationGatewayTotalTime'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelApplicationGatewayTotalTime')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelApplicationGatewayTime')],
    formatter: meanLatency.detailed,
    min: 0
  },

  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelThroughput')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelThroughput')],
    formatter: bytes.compact,
    min: 0
  },

  {
    metrics: ['totalRequests', 'failedRequests'],
    labels: [
      t('in-forge:plugins.azureApplicationGateway.labelTotalRequests'),
      t('in-forge:plugins.azureApplicationGateway.labelFailedRequests')
    ],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelRequests')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['requestsFailedPercentage'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelrequestsFailedPercentage')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelRequests')],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['unhealthyHostCount', 'healthyHostCount'],
    labels: [
      t('in-forge:plugins.azureApplicationGateway.labelUnhealthy'),
      t('in-forge:plugins.azureApplicationGateway.labelHealthy')
    ],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelHostCount')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['hostCountUnhealthyPercentage'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelHostCountUnhealthyPercentage')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelHostCount')],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['computeUnits'],
    labels: [t('in-forge:plugins.azureApplicationGateway.labelComputeUnits')],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelComputeUnits')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['bytesSent', 'bytesReceived'],
    labels: [
      t('in-forge:plugins.azureApplicationGateway.labelSent'),
      t('in-forge:plugins.azureApplicationGateway.labelReceived')
    ],
    category: [t('in-forge:plugins.azureApplicationGateway.category.labelBytes')],
    formatter: bytes.compact,
    min: 0
  }
];
