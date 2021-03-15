/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureSqlDb.labelCPUPercentage'),
    metric: 'metrics.cpu_percent',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureSqlDb.labelDTUPercentage'),
    metric: 'metrics.dtu_consumption_percent',
    formatter: percentagePlainTwoDecimalPlaces
  }
];
