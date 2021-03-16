/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentagePlain, bytesZeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.Capacity'],
    labels: [t('in-forge:plugins.azureApiManagement.labelCapacity')],
    category: [t('in-forge:plugins.azureApiManagement.capacity')],
    min: 0,
    formatter: percentagePlain.detailed
  },
  {
    metrics: [
      'metrics.TotalRequests',
      'metrics.SuccessfulRequests',
      'metrics.UnauthorizedRequests',
      'metrics.FailedRequests',
      'metrics.OtherRequests'
    ],
    labels: [
      t('in-forge:plugins.azureApiManagement.labelTotalGatewayRequests'),
      t('in-forge:plugins.azureApiManagement.labelSuccessfulGatewayRequests'),
      t('in-forge:plugins.azureApiManagement.labelUnauthorizedGatewayRequests'),
      t('in-forge:plugins.azureApiManagement.labelFailedGatewayRequests'),
      t('in-forge:plugins.azureApiManagement.labelOtherGatewayRequests')
    ],
    category: [t('in-forge:plugins.azureApiManagement.gatewayRequests')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.Duration'],
    labels: [t('in-forge:plugins.azureApiManagement.labelCapacityDuration')],
    category: [t('in-forge:plugins.azureApiManagement.latency')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      'EventHubTotalEvents',
      'EventHubSuccessfulEvents',
      'EventHubTotalFailedEvents',
      'EventHubRejectedEvents',
      'EventHubThrottledEvents',
      'EventHubTimedoutEvents',
      'EventHubDroppedEvents'
    ],
    labels: [
      t('in-forge:plugins.azureApiManagement.labelTotalEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelSuccessfulEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelFailedEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelRejectedEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelThrottledEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelTimedOutEventHubEvents'),
      t('in-forge:plugins.azureApiManagement.labelDroppedEventHubEvents')
    ],
    category: [t('in-forge:plugins.azureApiManagement.eventHubEvents')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['EventHubTotalBytesSent'],
    labels: [t('in-forge:plugins.azureApiManagement.labelSizeOfEventHubEvents')],
    category: [t('in-forge:plugins.azureApiManagement.sizeOfEventHubEvents')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  }
];
