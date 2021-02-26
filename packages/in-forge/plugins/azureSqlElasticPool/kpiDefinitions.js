/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.azureSqlElasticPool.labelCPUPercentage'),
    metric: 'metrics.cpu_percent',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureSqlElasticPool.labelEDTUPercentage'),
    metric: 'metrics.dtu_consumption_percent',
    formatter: percentagePlainTwoDecimalPlaces
  }
];
