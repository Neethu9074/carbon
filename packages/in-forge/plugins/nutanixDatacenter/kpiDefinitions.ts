/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpuUsage',
    label: t('in-forge:plugins.nutanixHost.cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'memoryUsage',
    label: t('in-forge:plugins.nutanixHost.memoryUsage'),
    formatter: percentage.detailed
  }
];
