/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['size'],
    labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelSize')],
    min: 0,
    category: [t('in-forge:plugins.azureServiceBus.dashboard.labelSize')],
    formatter: bytes.detailed
  },
  {
    metrics: ['messages'],
    labels: [t('in-forge:plugins.azureServiceBus.dashboard.labelMessages')],
    min: 0,
    category: [t('in-forge:plugins.azureServiceBus.dashboard.labelCount')],
    formatter: number
  },
  {
    metrics: ['deadletteredMessages', 'scheduledMessages', 'completeMessage', 'abandonMessage'],
    labels: [
      t('in-forge:plugins.azureServiceBus.dashboard.labelDeadletteredMessages'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelScheduledMessages'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelCompleteMessage'),
      t('in-forge:plugins.azureServiceBus.dashboard.labelAbandonMessage')
    ],
    min: 0,
    category: [t('in-forge:plugins.azureServiceBus.dashboard.labelMessages')],
    formatter: number
  }
];
