/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'unitMediaCapacityGb',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.unitMediaCapacityGb')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.percentUsed')],
    min: 0,
    formatter: percentage.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'elapsedPercentBusy',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedPercentBusy')],
    min: 0,
    formatter: percentage.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'unitStorageCapacity',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.unitStorageCapacity')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdLifeRemaining',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdLifeRemaining')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdPowerOnDays',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdPowerOnDays')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdBytesWritten',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdBytesWritten')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdPowerOnDays',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdSupportedBytesWritten')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'unitStorageCapacity',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.unitStorageCapacity')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'lifeRemaining',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.lifeRemaining')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'spareCapacity',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.spareCapacity')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'spareCapacityThreshold',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.spareCapacityThreshold')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'namespaceUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.namespaceUsed')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'powerCycles',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.powerCycles')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'powerOnHours',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.powerOnHours')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'mediaErrors',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.mediaErrors')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'unSafeShutDowns',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.unSafeShutDowns')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.percentUsed')],
    min: 0,
    formatter: percentage.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'elapsedPercentBusy',
        t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedPercentBusy')],
    min: 0,
    formatter: percentage.compact,
    category: [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.name')]
  }
];
