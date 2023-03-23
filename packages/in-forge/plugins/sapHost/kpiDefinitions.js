/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentagePlainZeroDecimalPlaces, kiloBytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.sapHost.cPUUsage'),
    metric: 'metrics.Performance.CPU_SYSTEM_UTILIZATION.value',
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.sapHost.memoryUsage'),
    metric: 'metrics.Performance.MEMORY_TOTAL_KB.value',
    formatter: kiloBytesZeroDecimalPlaces
  }
];
