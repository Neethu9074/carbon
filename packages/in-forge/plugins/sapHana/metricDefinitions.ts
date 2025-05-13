/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  number,
  bytes,
  percentage,
  millis,
  megaBytes,
  bytesTwoDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
// @ts-expect-error needs TS migration
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    formatter: percentage,
    metrics: ['stats.cpuUsage'],
    labels: [t('in-forge:plugins.sapHana.cpuUsageMetricDef')],
    min: 0
  },
  {
    formatter: bytes,
    metrics: ['stats.diskUsageData', 'stats.diskUsageLog', 'stats.diskUsageTrace'],
    labels: [
      t('in-forge:plugins.sapHana.dataSize'),
      t('in-forge:plugins.sapHana.logSize'),
      t('in-forge:plugins.sapHana.traceSize')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.sessionsTotalCount',
      'stats.sessionsIdleCount',
      'stats.sessionsRunningCount',
      'stats.sessionsBlockedCount',
      'stats.sessionsBlockingCount'
    ],
    labels: [
      t('in-forge:plugins.sapHana.total'),
      t('in-forge:plugins.sapHana.idle'),
      t('in-forge:plugins.sapHana.running'),
      t('in-forge:plugins.sapHana.blockedSessions'),
      t('in-forge:plugins.sapHana.blockingSessions')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.tcpSegmentsReceived',
      'stats.tcpSegmentsSentOut',
      'stats.tcpSegmentsRetransmitted',
      'stats.tcpBadSegmentsReceived'
    ],
    labels: [
      t('in-forge:plugins.sapHana.tcpSegmentsReceived'),
      t('in-forge:plugins.sapHana.tcpSegmentsSentOut'),
      t('in-forge:plugins.sapHana.tcpSegmentsRetransmitted'),
      t('in-forge:plugins.sapHana.tcpBadSegmentsReceived')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.sessionsDatabaseUsers', 'stats.sessionsApplications', 'stats.sessionsApplicationUsers'],
    labels: [
      t('in-forge:plugins.sapHana.databaseUsers'),
      t('in-forge:plugins.sapHana.running'),
      t('in-forge:plugins.sapHana.applicationUsers')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.threadsTotalCount', 'stats.threadsActiveCount', 'stats.threadsBlockedCount'],
    labels: [
      t('in-forge:plugins.sapHana.total'),
      t('in-forge:plugins.sapHana.active'),
      t('in-forge:plugins.sapHana.blockedThreads')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.threadsJobWorkerCount', 'stats.threadsJobWorkerActiveCount', 'stats.threadsJobWorkerBlockedCount'],
    labels: [
      t('in-forge:plugins.sapHana.total'),
      t('in-forge:plugins.sapHana.active'),
      t('in-forge:plugins.sapHana.threadsJobWorkerBlockedCount')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.threadsSqlExecutorCount',
      'stats.threadsSqlExecutorActiveCount',
      'stats.threadsSqlExecutorBlockedCount'
    ],
    labels: [
      t('in-forge:plugins.sapHana.total'),
      t('in-forge:plugins.sapHana.active'),
      t('in-forge:plugins.sapHana.threadsSqlExecutorBlockedCount')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.stmtExecutions',
      'stats.stmtCompilations',
      'stats.updateTransactions',
      'stats.rollbacks',
      'stats.commits'
    ],
    labels: [
      t('in-forge:plugins.sapHana.statementExecutions'),
      t('in-forge:plugins.sapHana.statementCompilations'),
      t('in-forge:plugins.sapHana.updateTransactions'),
      t('in-forge:plugins.sapHana.rollbacks'),
      t('in-forge:plugins.sapHana.commits')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.currentStmtExecutionRate',
      'stats.currentStmtCompilationRate',
      'stats.currentUpdateTransactionRate',
      'stats.currentRollbackRate',
      'stats.currentCommitRate'
    ],
    labels: [
      t('in-forge:plugins.sapHana.currentStmtExecutionRate'),
      t('in-forge:plugins.sapHana.currentStmtCompilationRate'),
      t('in-forge:plugins.sapHana.currentUpdateTransactionRate'),
      t('in-forge:plugins.sapHana.currentRollbackRate'),
      t('in-forge:plugins.sapHana.currentCommitRate')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.indexServerFinishedRequests',
      'stats.indexServerActiveRequests',
      'stats.indexServerPendingRequests'
    ],
    labels: [
      t('in-forge:plugins.sapHana.finishedRequests'),
      t('in-forge:plugins.sapHana.activeRequests'),
      t('in-forge:plugins.sapHana.pendingRequests')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.runningCount', 'stats.idleCount', 'stats.queueingCount'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.running'),
      t('in-forge:plugins.sapHana.dashboard.idle'),
      t('in-forge:plugins.sapHana.queueingConnectionCount')
    ],
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'garbageCollectionStats',
        'historyCount',
        t('in-forge:plugins.sapHana.dashboard.historyCount')
      ),
      getDynamicMetricMatch(
        'garbageCollectionStats',
        'waiterCount',
        t('in-forge:plugins.sapHana.dashboard.waiterCount')
      ),
      getDynamicMetricMatch(
        'garbageCollectionStats',
        'startedJobs',
        t('in-forge:plugins.sapHana.dashboard.startedJobs')
      ),
      getDynamicMetricMatch(
        'garbageCollectionStats',
        'processedJobs',
        t('in-forge:plugins.sapHana.dashboard.processedJobs')
      ),
      getDynamicMetricMatch('garbageCollectionStats', 'queueLoads', t('in-forge:plugins.sapHana.dashboard.queueLoads'))
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.historyCount'),
      t('in-forge:plugins.sapHana.dashboard.waiterCount'),
      t('in-forge:plugins.sapHana.dashboard.startedJobs'),
      t('in-forge:plugins.sapHana.dashboard.processedJobs'),
      t('in-forge:plugins.sapHana.dashboard.queueLoads')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.garbageCollectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'expensiveStatementStats',
        'executionTime',
        t('in-forge:plugins.sapHana.dashboard.executionTime')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.executionTime')],
    category: [t('in-forge:plugins.sapHana.dashboard.expensiveStatementStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sqlPlanCacheStats',
        'avgExecutionTime',
        t('in-forge:plugins.sapHana.dashboard.avgExecutionTime')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.avgExecutionTime')],
    category: [t('in-forge:plugins.sapHana.dashboard.expensiveStatementStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sqlPlanCacheStats',
        'executionCount',
        t('in-forge:plugins.sapHana.dashboard.executionCount')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.executionCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.sqlPlanCacheStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('lockWaitStats', 'totalLockWaits', t('in-forge:plugins.sapHana.dashboard.totalLockWaits'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.totalLockWaits')],
    category: [t('in-forge:plugins.sapHana.dashboard.lockWaitStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'lockWaitStats',
        'totalLockWaitTime',
        t('in-forge:plugins.sapHana.dashboard.totalLockWaitTime')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.totalLockWaitTime')],
    category: [t('in-forge:plugins.sapHana.dashboard.lockWaitStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('tableSizeStats', 'recordCount', t('in-forge:plugins.sapHana.dashboard.recordCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.recordCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.tableSize')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('tableSizeStats', 'tableSize', t('in-forge:plugins.sapHana.dashboard.tableSize'))],
    labels: [t('in-forge:plugins.sapHana.dashboard.tableSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.tableSize')],
    min: 0,
    formatter: megaBytes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('sharedMemoryStats', 'allocatedSize', t('in-forge:plugins.sapHana.dashboard.allocatedSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.allocatedSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.allocatedSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('sharedMemoryStats', 'freeSize', t('in-forge:plugins.sapHana.dashboard.freeSize'))],
    labels: [t('in-forge:plugins.sapHana.dashboard.freeSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.freeSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('sharedMemoryStats', 'usedSize', t('in-forge:plugins.sapHana.dashboard.usedSize'))],
    labels: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'rowStoreMemoryStats',
        'allocatedSize',
        t('in-forge:plugins.sapHana.dashboard.allocatedSize')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.allocatedSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.allocatedSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch('rowStoreMemoryStats', 'freeSize', t('in-forge:plugins.sapHana.dashboard.freeSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.freeSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.freeSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch('rowStoreMemoryStats', 'usedSize', t('in-forge:plugins.sapHana.dashboard.usedSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'rowStoreMemoryStats',
        'usedPercentage',
        t('in-forge:plugins.sapHana.dashboard.usedPercentage')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.usedPercentage')],
    category: [t('in-forge:plugins.sapHana.dashboard.usedPercentage')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'usedSize', t('in-forge:plugins.sapHana.dashboard.usedSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.usedSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'totalSize', t('in-forge:plugins.sapHana.dashboard.totalSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.totalSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.totalSize')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'entryCount', t('in-forge:plugins.sapHana.dashboard.entryCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.entryCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.entryCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'insertCount', t('in-forge:plugins.sapHana.dashboard.insertCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.insertCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.aggregatedCacheStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'aggregatedCacheStats',
        'invalidateCount',
        t('in-forge:plugins.sapHana.dashboard.invalidateCount')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.invalidateCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.aggregatedCacheStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'hitCount', t('in-forge:plugins.sapHana.dashboard.hitCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.hitCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.aggregatedCacheStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('aggregatedCacheStats', 'missCount', t('in-forge:plugins.sapHana.dashboard.missCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.missCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.aggregatedCacheStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('networkStats', 'requestCount', t('in-forge:plugins.sapHana.dashboard.requestCount'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.requestCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.networkStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('networkStats', 'sendSize', t('in-forge:plugins.sapHana.dashboard.sendSize'))],
    labels: [t('in-forge:plugins.sapHana.dashboard.sendSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.networkStats')],
    min: 0,
    formatter: megaBytes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('networkStats', 'receiveSize', t('in-forge:plugins.sapHana.dashboard.receiveSize'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.receiveSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.networkStats')],
    min: 0,
    formatter: megaBytes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('networkStats', 'sendDuration', t('in-forge:plugins.sapHana.dashboard.sendDuration'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.sendDuration')],
    category: [t('in-forge:plugins.sapHana.dashboard.networkStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('networkStats', 'receiveDuration', t('in-forge:plugins.sapHana.dashboard.receiveDuration'))
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.receiveDuration')],
    category: [t('in-forge:plugins.sapHana.dashboard.networkStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: ['stats.usedMemory', 'stats.instanceTotalMemoryPeakUsed', 'stats.allocationLimit'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.used'),
      t('in-forge:plugins.sapHana.dashboard.peakUsed'),
      t('in-forge:plugins.sapHana.dashboard.allocationLimit')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.hanaMemoryUsage')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['stats.hanaUtilisationRatio'],
    labels: [t('in-forge:plugins.sapHana.dashboard.utilisationRatio')],
    category: [t('in-forge:plugins.sapHana.dashboard.hanaMemoryUsage')],
    formatter: percentage,
    min: 0
  },
  {
    metrics: ['stats.freePhysicalMemory', 'stats.usedPhysicalMemory', 'stats.totalPhysicalMemory'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.free'),
      t('in-forge:plugins.sapHana.dashboard.used'),
      t('in-forge:plugins.sapHana.dashboard.total')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.hostMemoryUsage')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['stats.hostUsedPhysicalMemoryRatio'],
    labels: [t('in-forge:plugins.sapHana.dashboard.hostUsedPhysicalMemoryRatio')],
    category: [t('in-forge:plugins.sapHana.dashboard.hostMemoryUsage')],
    formatter: percentage,
    min: 0
  },
  {
    metrics: ['stats.totalHeapAllocated', 'stats.totalHeapUsed'],
    labels: [t('in-forge:plugins.sapHana.dashboard.allocated'), t('in-forge:plugins.sapHana.dashboard.used')],
    formatter: bytesTwoDecimalPlaces,
    category: [t('in-forge:plugins.sapHana.dashboard.heapMemory')],
    min: 0
  },
  {
    metrics: ['stats.logicalMemory'],
    labels: [t('in-forge:plugins.sapHana.dashboard.virtualMemory')],
    formatter: bytesTwoDecimalPlaces,
    category: [t('in-forge:plugins.sapHana.dashboard.virtualMemory')],
    min: 0
  },
  {
    metrics: ['stats.freeSwapSpace', 'stats.usedSwapSpace'],
    labels: [t('in-forge:plugins.sapHana.dashboard.free'), t('in-forge:plugins.sapHana.dashboard.used')],
    category: [t('in-forge:plugins.sapHana.dashboard.swapMemory')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'stats.totalCpuUserTime',
      'stats.totalCpuSystemTime',
      'stats.totalCpuIdleTime',
      'stats.totalCpuWaitIOTime'
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.totalCpuUserTime'),
      t('in-forge:plugins.sapHana.dashboard.totalCpuSystemTime'),
      t('in-forge:plugins.sapHana.dashboard.totalCpuWaitIOTime'),
      t('in-forge:plugins.sapHana.dashboard.idle')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.cpuTimeSpent')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['backupStats.transferredSize', 'backupStats.backupSize'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.transferredSize'),
      t('in-forge:plugins.sapHana.dashboard.backupSize')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.backupStats')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['backupStats.duration'],
    labels: [t('in-forge:plugins.sapHana.dashboard.duration')],
    category: [t('in-forge:plugins.sapHana.dashboard.backupStats')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['serviceDetailsStats.processCpu'],
    labels: [t('in-forge:plugins.sapHana.dashboard.processCpuPerc')],
    category: [t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')],
    formatter: percentage.detailed,
    min: 0
  },
  {
    metrics: ['serviceDetailsStats.openFileCount'],
    labels: [t('in-forge:plugins.sapHana.dashboard.openFileCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['serviceDetailsStats.processCpuTime'],
    labels: [t('in-forge:plugins.sapHana.dashboard.processCpuTime')],
    category: [t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')],
    formatter: seconds.detailed,
    min: 0
  },
  {
    metrics: ['serviceDetailsStats.processPhysicalMemory', 'serviceDetailsStats.processMemory'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.processPhysicalMemory'),
      t('in-forge:plugins.sapHana.dashboard.processMemory')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceDetailsStats.serviceThreadCount', 'serviceDetailsStats.serviceActiveThreadCount'],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.serviceThreadCount'),
      t('in-forge:plugins.sapHana.dashboard.serviceActiveThreadCount')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['archiveLogBackupStats.backupSize'],
    labels: [t('in-forge:plugins.sapHana.dashboard.backupSize')],
    category: [t('in-forge:plugins.sapHana.dashboard.archiveLogBackupStats')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['archiveLogBackupStats.duration'],
    labels: [t('in-forge:plugins.sapHana.dashboard.duration')],
    category: [t('in-forge:plugins.sapHana.dashboard.archiveLogBackupStats')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['stats.totalDiskUsagePercentage'],
    labels: [t('in-forge:plugins.sapHana.dashboard.diskUsagePercentage')],
    category: [t('in-forge:plugins.sapHana.dashboard.diskUsagePercentage')],
    formatter: percentage.detailed,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'transactionStats',
        'acquiredLockCount',
        t('in-forge:plugins.sapHana.dashboard.acquiredLockCount')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.acquiredLockCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.transactionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'transactionStats',
        'activeStatementCount',
        t('in-forge:plugins.sapHana.dashboard.activeStatementCount')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.activeStatementCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.transactionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeStatementStats',
        'executionCount',
        t('in-forge:plugins.sapHana.dashboard.executionCount')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.executionCount')],
    category: [t('in-forge:plugins.sapHana.dashboard.activeStatementStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeStatementStats',
        'avgExecutionTime',
        t('in-forge:plugins.sapHana.dashboard.avgExecutionTime')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.avgExecutionTime')],
    category: [t('in-forge:plugins.sapHana.dashboard.activeStatementStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeStatementStats',
        'usedMemorySize',
        t('in-forge:plugins.sapHana.dashboard.usedMemorySize')
      )
    ],
    labels: [t('in-forge:plugins.sapHana.dashboard.usedMemorySize')],
    category: [t('in-forge:plugins.sapHana.dashboard.activeStatementStats')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('ioStats', 'totalReadSize', t('in-forge:plugins.sapHana.dashboard.totalReadSize')),
      getDynamicMetricMatch('ioStats', 'totalReadSize', t('in-forge:plugins.sapHana.dashboard.totalWriteSize'))
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.totalReadSize'),
      t('in-forge:plugins.sapHana.dashboard.totalWriteSize')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.ioStats')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('ioStats', 'totalFailedReads', t('in-forge:plugins.sapHana.dashboard.totalFailedReads')),
      getDynamicMetricMatch('ioStats', 'totalFailedWrites', t('in-forge:plugins.sapHana.dashboard.totalFailedWrites'))
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.totalFailedReads'),
      t('in-forge:plugins.sapHana.dashboard.totalFailedWrites')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.ioStats')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('ioStats', 'totalReadTime', t('in-forge:plugins.sapHana.dashboard.totalReadTime')),
      getDynamicMetricMatch('ioStats', 'totalWriteTime', t('in-forge:plugins.sapHana.dashboard.totalWriteTime'))
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.totalReadTime'),
      t('in-forge:plugins.sapHana.dashboard.totalWriteTime')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.ioStats')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('jobProgressStats', 'maxProgress', t('in-forge:plugins.sapHana.dashboard.maxProgress')),
      getDynamicMetricMatch(
        'jobProgressStats',
        'currentProgress',
        t('in-forge:plugins.sapHana.dashboard.currentProgress')
      )
    ],
    labels: [
      t('in-forge:plugins.sapHana.dashboard.maxProgress'),
      t('in-forge:plugins.sapHana.dashboard.currentProgress')
    ],
    category: [t('in-forge:plugins.sapHana.dashboard.jobProgressStats')],
    min: 0,
    formatter: number.compact
  }
];
