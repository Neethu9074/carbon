/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'utilizedProcUnits',
      'availableProcUnits',
      'currentReservedProcUnits',
      'assignedProcUnits',
      'totalEntitledProcUnits'
    ],
    labels: [
      t('in-forge:plugins.phmcSharedProcessorPool.utilizedProcUnits'),
      t('in-forge:plugins.phmcSharedProcessorPool.availableProcUnits'),
      t('in-forge:plugins.phmcSharedProcessorPool.currentReservedProcUnits'),
      t('in-forge:plugins.phmcSharedProcessorPool.assignedProcUnits'),
      t('in-forge:plugins.phmcSharedProcessorPool.totalEntitledProcUnits')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['entitledProcUnitsUsedPercent', 'utilizedProcUnitsPercent', 'availableProcUnitsPercent'],
    labels: [
      t('in-forge:plugins.phmcSharedProcessorPool.entitledProcUnitsUsedPercent'),
      t('in-forge:plugins.phmcSharedProcessorPool.utilizedProcUnitsPercent'),
      t('in-forge:plugins.phmcSharedProcessorPool.availableProcUnitsPercent')
    ],
    min: 0,
    formatter: percentage
  }
];
