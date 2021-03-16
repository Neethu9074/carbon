/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.garden.cpuTotalPercentage'),
    metric: 'cpu.total',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.garden.memoryUsage'),
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  }
];
