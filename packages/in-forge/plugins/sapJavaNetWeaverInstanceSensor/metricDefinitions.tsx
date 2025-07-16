/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['customMetrics.kpi.cpuUsage'],
    labels: [t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.cpuUsage')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: ['customMetrics.kpi.memoryUsage'],
    labels: [t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.memoryUsage')],
    min: 0,
    formatter: percentage.detailed
  }
];
