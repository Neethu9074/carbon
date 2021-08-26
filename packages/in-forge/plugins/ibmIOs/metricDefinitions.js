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
  }
];
