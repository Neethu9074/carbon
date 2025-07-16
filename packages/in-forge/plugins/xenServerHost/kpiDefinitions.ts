/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { kiloBytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_avg',
    label: t('in-xenserver:dashboards.cpuAvg'),
    formatter: number.detailed
  },
  {
    metric: 'memory_free_kib',
    label: t('in-xenserver:dashboards.memoryFree'),
    formatter: kiloBytesTwoDecimalPlaces
  }
];
