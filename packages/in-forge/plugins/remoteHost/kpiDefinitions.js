/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.host.cpuUsed'),
    metric: 'cpu.used',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.host.memoryUsed'),
    metric: 'memory.used',
    formatter: percentageZeroDecimalPlaces
  }
];
