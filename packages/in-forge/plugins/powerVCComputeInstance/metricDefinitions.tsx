/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpuUsage'],
    labels: [t('in-forge:plugins.powerVCComputeInstance.cpuUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['memoryUsage'],
    labels: [t('in-forge:plugins.powerVCComputeInstance.memoryUsage')],
    min: 0,
    formatter: percentage
  }
];
