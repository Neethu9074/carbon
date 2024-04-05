/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.podman.cpuTotalUsage'),
    metric: 'cpu.total_usage',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.podman.cpuThrottlingCount'),
    metric: 'cpu.throttling_count',
    formatter: number.compact
  }
];
