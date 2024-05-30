/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'totalProcUnits',
      'utilizedProcUnits',
      'availableProcUnits',
      'configurableProcUnits',
      'assignedMemHypervisor',
      'powerReading'
    ],
    labels: [
      t('in-forge:plugins.phmcSystem.totalProcUnits'),
      t('in-forge:plugins.phmcSystem.utilizedProcUnits'),
      t('in-forge:plugins.phmcSystem.availableProcUnits'),
      t('in-forge:plugins.phmcSystem.configurableProcUnits'),
      t('in-forge:plugins.phmcSystem.assignedMemHypervisor'),
      t('in-forge:plugins.phmcSystem.powerReading')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'totalProcUnitsPercent',
      'utilizedProcUnitsPercent',
      'availableProcUnitsPercent',
      'configurableProcUnitsPercent'
    ],
    labels: [
      t('in-forge:plugins.phmcSystem.totalProcUnitsPercent'),
      t('in-forge:plugins.phmcSystem.utilizedProcUnitsPercent'),
      t('in-forge:plugins.phmcSystem.availableProcUnitsPercent'),
      t('in-forge:plugins.phmcSystem.configurableProcUnitsPercent')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['totalMem', 'availableMem', 'configurableMem', 'assignedMemToLpars'],
    labels: [
      t('in-forge:plugins.phmcSystem.totalMem'),
      t('in-forge:plugins.phmcSystem.availableMem'),
      t('in-forge:plugins.phmcSystem.configurableMem'),
      t('in-forge:plugins.phmcSystem.assignedMemToLpars')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'totalMemPercentage',
      'availableMemPercentage',
      'configurableMemPercentage',
      'assignedMemToLparsPercentage'
    ],
    labels: [
      t('in-forge:plugins.phmcSystem.totalMemPercentage'),
      t('in-forge:plugins.phmcSystem.availableMemPercentage'),
      t('in-forge:plugins.phmcSystem.configurableMemPercentage'),
      t('in-forge:plugins.phmcSystem.assignedMemToLparsPercentage')
    ],
    min: 0,
    formatter: percentage
  },

  {
    metrics: [
      getDynamicMetricMatch('sriovAdapters', 'receivedPackets', t('in-forge:plugins.phmcSystem.adapter')),
      getDynamicMetricMatch('sriovAdapters', 'sentPackets', t('in-forge:plugins.phmcSystem.adapter')),
      getDynamicMetricMatch('sriovAdapters', 'droppedPackets', t('in-forge:plugins.phmcSystem.adapter'))
    ],
    labels: [
      t('in-forge:plugins.phmcSystem.receivedPackets'),
      t('in-forge:plugins.phmcSystem.sentPackets'),
      t('in-forge:plugins.phmcSystem.droppedPackets')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sriovAdapters', 'sentBytes', t('in-forge:plugins.phmcSystem.adapter')),
      getDynamicMetricMatch('sriovAdapters', 'receivedBytes', t('in-forge:plugins.phmcSystem.adapter')),
      getDynamicMetricMatch('sriovAdapters', 'transferredBytes', t('in-forge:plugins.phmcSystem.adapter'))
    ],
    labels: [
      t('in-forge:plugins.phmcSystem.sentBytes'),
      t('in-forge:plugins.phmcSystem.receivedBytes'),
      t('in-forge:plugins.phmcSystem.transferredBytes')
    ],
    min: 0,
    formatter: bytes
  },

  {
    metrics: [
      getDynamicMetricMatch('sriovAdapters', 'errorIn', t('in-forge:plugins.phmcSystem.adapter')),
      getDynamicMetricMatch('sriovAdapters', 'errorOut', t('in-forge:plugins.phmcSystem.adapter'))
    ],
    labels: [t('in-forge:plugins.phmcSystem.errorIn'), t('in-forge:plugins.phmcSystem.errorOut')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metrics: [
      getDynamicMetricMatch('inletTemperatures', 'temperatureReading', t('in-forge:plugins.phmcSystem.entityId'))
    ],
    labels: [t('in-forge:plugins.phmcSystem.inletTemperatureReading')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('cpuTemperatures', 'temperatureReading', t('in-forge:plugins.phmcSystem.entityId'))
    ],
    labels: [t('in-forge:plugins.phmcSystem.cpuTemperatureReading')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('baseBoardTemperatures', 'temperatureReading', t('in-forge:plugins.phmcSystem.entityId'))
    ],
    labels: [t('in-forge:plugins.phmcSystem.baseBoardTemperatureReading')],
    min: 0,
    formatter: number
  }
];
