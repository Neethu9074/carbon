/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { megaBytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureDatabricks.labelTotalExecutorCount'),
    metric: 'totalExecutorCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureDatabricks.labelTotalJobCount'),
    metric: 'totalJobCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureDatabricks.labelTotalMemoryMb'),
    metric: 'totalMemoryMb',
    formatter: megaBytes.compact
  }
];
