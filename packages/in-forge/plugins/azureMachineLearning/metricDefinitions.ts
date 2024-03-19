/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, megaBytes, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cancelledRuns', 'completedRuns', 'failedRuns', 'startedRuns', 'errors'],
    labels: [
      t('in-forge:plugins.azureMachineLearning.dashboard.labelCancelledRuns'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelCompletedRuns'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelFailedRuns'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelStartedRuns'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelErrors')
    ],
    min: 0,
    category: [t('in-forge:plugins.azureMachineLearning.dashboard.labelRun')],
    formatter: number.compact
  },
  {
    metrics: ['cpuUtilizationPercentage', 'gpuUtilizationPercentage'],
    labels: [
      t('in-forge:plugins.azureMachineLearning.dashboard.labelCpuUtilization'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelGpuUtilization')
    ],
    min: 0,
    category: [t('in-forge:plugins.azureMachineLearning.dashboard.labelResource')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metrics: ['diskUsedMegabytes', 'diskReadMegabytes', 'diskWriteMegabytes'],
    labels: [
      t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskUsedMegabytes'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskReadMegabytes'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskWriteMegabytes')
    ],
    min: 0,
    category: [t('in-forge:plugins.azureMachineLearning.dashboard.labelResource')],
    formatter: megaBytes.compact
  },
  {
    metrics: ['totalNodes', 'activeNodes', 'totalCores', 'activeCores'],
    labels: [
      t('in-forge:plugins.azureMachineLearning.dashboard.labelTotalNodes'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelActiveNodes'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelTotalCores'),
      t('in-forge:plugins.azureMachineLearning.dashboard.labelActiveCores')
    ],
    min: 0,
    category: [t('in-forge:plugins.azureMachineLearning.dashboard.labelQuota')],
    formatter: number.compact
  }
];
