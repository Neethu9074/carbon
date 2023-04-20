/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['avgCPURate'],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.cpu.rate')],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.cpu.name')]
  },
  {
    metrics: ['avgCPUUtil', 'minCPUUtil', 'maxCPUUtil'],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.avg'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.min'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.max')
    ],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.name')]
  },
  {
    metrics: ['activeJobs', 'interactiveJobs', 'totalJobs', 'maxJobs'],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.active'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.interactive'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.total'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.max')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.name')]
  },
  {
    metrics: ['sysASPUsed'],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.used')],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.name')]
  },
  {
    metrics: ['sysASPStorage'],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.capacity')],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.name')]
  },
  {
    metrics: ['currTempStorage', 'maxTempStorage'],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.current'),
      t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.max')
    ],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.name')]
  },
  {
    metrics: ['activeThreads'],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.threads.active')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.threads.name')]
  },
  {
    metrics: ['totalSpoolSpace'],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.totalSpoolSpace.totalSize')],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.charts.totalSpoolSpace.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch('memoryPoolMetrics', 'currSize', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'resSize', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'defSize', t('in-forge:plugins.ibmIOs.memoryPool'))
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageUsed'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageReserved'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageDefined')
    ],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch('memoryPoolMetrics', 'elapsedDatabaseFaults', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'elapsedTotalFaults', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'elapsedNonDatabaseFaults', t('in-forge:plugins.ibmIOs.memoryPool'))
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.pagesFaultRate.elapsedDatabaseFaults'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.pagesFaultRate.elapsedTotalFaults'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.pagesFaultRate.elapsedNonDatabaseFaults')
    ],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'totalCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      ),
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'protectedCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      ),
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'unprotectedCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      )
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.totalCapacity'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.protectedCapacity'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.unprotectedCapacity')
    ],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'totalCapacityUtilization',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      ),
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'protectedCapacityUtilization',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      ),
      getDynamicMetricMatch(
        'aspInfoMetrics',
        'unprotectedCapacityUtilization',
        t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')
      )
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.totalCapacityUtilization'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.protectedCapacityUtilization'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.unprotectedCapacityUtilization')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch('memoryPoolMetrics', 'currThreads', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'currIneligibleThreads', t('in-forge:plugins.ibmIOs.memoryPool')),
      getDynamicMetricMatch('memoryPoolMetrics', 'maxActiveThreads', t('in-forge:plugins.ibmIOs.memoryPool'))
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.activeThreads'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.ineligibleThreads'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.maxActiveThreads')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'threadCount',
        t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.threadCount')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'temporaryStorage',
        t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.temporaryStorage')],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'elapsedCPU',
        t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.elapsedCPU')],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'outputQueueMetrics',
        'fileCount',
        t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.name')
      ),
      getDynamicMetricMatch(
        'outputQueueMetrics',
        'status',
        t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.name')
      ),
      getDynamicMetricMatch(
        'outputQueueMetrics',
        'writerJobStatus',
        t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.name')
      )
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.fileCount'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.status'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.writerJobStatus')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.outputQueues.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'subsystemMetrics',
        'activeJobs',
        t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.name')
      ),
      getDynamicMetricMatch(
        'subsystemMetrics',
        'maxActiveJobs',
        t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.name')
      )
    ],
    labels: [
      t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.activeJobs'),
      t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.maxActiveJobs')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch('jobQueueMetrics', 'heldJobs', t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name'))
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.heldJobs')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'jobQueueMetrics',
        'releasedJobs',
        t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.releasedJobs')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'jobQueueMetrics',
        'scheduledJobs',
        t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.scheduledJobs')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatInterfaceMetrics',
        'status',
        t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInterfaces.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInterfaces.status')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInterfaces.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesOut',
        'bytesSentRemotely',
        t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesOutName')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesSentRemotely')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesOutName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesOut',
        'bytesReceivedLocally',
        t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesOutName')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesReceivedLocally')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesOutName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesIn',
        'bytesSentRemotely',
        t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesInName')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesSentRemotely')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesInName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesIn',
        'bytesReceivedLocally',
        t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesInName')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesReceivedLocally')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.netstatInfo.bytesInName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'messageQueueMetrics',
        'severity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.severity')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'messageQueueMetrics',
        'messageType',
        t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.messageType')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.messageQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'historyLogMetrics',
        'severity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.severity')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'historyLogMetrics',
        'messageType',
        t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageType')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'unitMediaCapacityGb',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitMediaCapacityGb')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'unitStorageCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitStorageCapacity')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'elapsedIoRequests',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedIoRequests')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'elapsedRequestSize',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedRequestSize')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSpinningDiskTypeMetrics',
        'elapsedPercentBusy',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedPercentBusy')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'unitStorageCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitStorageCapacity')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSpinningDiskTypeMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdLifeRemaining',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdLifeRemaining')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdPowerOnDays',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdPowerOnDays')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdBytesWritten',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdBytesWritten')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'advanceSolidStateDiskMetrics',
        'ssdPowerOnDays',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdSupportedBytesWritten')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.aspNumber')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'unitStorageCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitStorageCapacity')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'basicSolidStateDiskMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'lifeRemaining',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.lifeRemaining')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'spareCapacity',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.spareCapacity')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'spareCapacityThreshold',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.spareCapacityThreshold')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'namespaceAvailable',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.namespaceAvailable')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'namespaceUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.namespaceUsed')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'powerCycles',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.powerCycles')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'powerOnHours',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.powerOnHours')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'mediaErrors',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.mediaErrors')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'unSafeShutDowns',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.unSafeShutDowns')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nonVolatileMemoryMetrics',
        'compositeTemperature',
        t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.compositeTemperature')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'unitNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.unitNumber')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'aspNumber',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.aspNumber')],
    min: 0,
    formatter: number.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'percentUsed',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.percentUsed')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'elapsedIORequests',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.charts.elapsedIORequests')],
    min: 0,
    formatter: number.compact,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'elapsedRequestSize',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.charts.elapsedRequestSize')],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'systemDiskStatusMetrics',
        'elapsedPercentBusy',
        t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.charts.elapsedPercentBusy')],
    min: 0,
    formatter: percentage.detailed,
    category: [t('in-forge:plugins.ibmIOs.dashboard.tables.systemDiskStatus.name')]
  }
];
