/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { kiloBytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_usage',
    label: t('in-xenserver:dashboards.cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'memory',
    label: t('in-xenserver:dashboards.memoryTotal'),
    formatter: kiloBytesTwoDecimalPlaces
  }
];
