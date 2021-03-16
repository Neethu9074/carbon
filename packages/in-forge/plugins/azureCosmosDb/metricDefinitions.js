/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.instance.tr', 'metrics.instance.mr', 'metrics.instance.dc'],
    labels: [
      t('in-forge:plugins.azureCosmosDB.labelTr'),
      t('in-forge:plugins.azureCosmosDB.labelMr'),
      t('in-forge:plugins.azureCosmosDB.labelDc')
    ],
    category: [t('in-forge:plugins.azureCosmosDb.instanceKpi')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.instance.sa'],
    labels: [t('in-forge:plugins.azureCosmosDB.labelSa')],
    category: [t('in-forge:plugins.azureCosmosDb.instanceKpi')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['metrics.instance.rl', 'metrics.instance.wl'],
    labels: [t('in-forge:plugins.azureCosmosDB.labelRl'), t('in-forge:plugins.azureCosmosDB.labelWl')],
    category: [t('in-forge:plugins.azureCosmosDb.instanceKpi')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  }
];
