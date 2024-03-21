/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { percentagePlainTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureMachineLearning.kpi.labelCpuUtilization'),
    metric: 'cpuUtilizationPercentage',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureMachineLearning.kpi.labelActiveNodes'),
    metric: 'activeNodes',
    formatter: number.compact
  }
];
