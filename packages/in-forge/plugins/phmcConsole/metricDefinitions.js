/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalProcUnits', 'utilizedProcUnits', 'availableProcUnits', 'configurableProcUnits'],
    labels: [
      t('in-forge:plugins.phmcConsole.total'),
      t('in-forge:plugins.phmcConsole.utilized'),
      t('in-forge:plugins.phmcConsole.available'),
      t('in-forge:plugins.phmcConsole.configurable')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['totalMem', 'availableMem', 'configurableMem', 'assignedMemToLpars'],
    labels: [
      t('in-forge:plugins.phmcConsole.total'),
      t('in-forge:plugins.phmcConsole.available'),
      t('in-forge:plugins.phmcConsole.configurable'),
      t('in-forge:plugins.phmcConsole.assignedMem')
    ],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'backedPhysicalMem', t('in-forge:plugins.phmcConsole.logicalPartition'))
    ],
    labels: t('in-forge:plugins.phmcConsole.backedPhysicalMem'),
    category: [t('in-forge:plugins.phmcConsole.logicalPartition')],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'entitledProcUnits', t('in-forge:plugins.phmcConsole.logicalPartition'))
    ],
    labels: t('in-forge:plugins.phmcConsole.entitledProcUnits'),
    category: [t('in-forge:plugins.phmcConsole.logicalPartition')],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      getDynamicMetricMatch(
        'logicalPartition',
        'maxVirtualProcessors',
        t('in-forge:plugins.phmcConsole.logicalPartition')
      )
    ],
    labels: t('in-forge:plugins.phmcConsole.maxVirtualProcessors'),
    category: [t('in-forge:plugins.phmcConsole.logicalPartition')],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      getDynamicMetricMatch(
        'logicalPartition',
        'currentVirtualProcessors',
        t('in-forge:plugins.phmcConsole.logicalPartition')
      )
    ],
    labels: t('in-forge:plugins.phmcConsole.currentVirtualProcessors'),
    category: [t('in-forge:plugins.phmcConsole.logicalPartition')],
    min: 0,
    formatter: number
  }
];
