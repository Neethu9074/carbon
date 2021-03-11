/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureCosmosDb.totalRequests'),
    metric: 'metrics.instance.tr',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureCosmosDb.serviceAvailability'),
    metric: 'metrics.instance.sa',
    formatter: percentage.compact
  }
];
