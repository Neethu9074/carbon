/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes, millis, seconds } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['workloadcounts.onHold'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.onHold')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.running'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.running')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.waiting'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.waiting')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.workProcessRowCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.workProcessRowCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.dbConnectionCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.dbConnectionCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalDumpsCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.status'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.connectionStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.numberOfDumps'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalRFCCalls'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalRFCCalls')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalMemory'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['workloadcounts.numberOfDialogProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfDialogProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfSpoolProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfSpoolProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBackgroundProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfBackgroundProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBatchProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfBatchProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfEnqueueProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfEnqueueProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdateProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfUpdateProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdate2Process'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfUpdate2Process')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalCpuUtilization'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.cpuUtilization')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['sapMetricsStats.userSession'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.userSession')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageIn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pageIn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageOut'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pageOut')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['swapmemory.swapConf'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapConf')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.freeSwap'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.freeSwap')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapSize'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapSize')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapMax'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapMax')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['icminfodatastats.status'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.traceLvl'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.traceLvl')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxThr'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekThr'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.curConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.curQueue')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['spoolStats.count'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.count')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.processed'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.processed')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.pJPages'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pJPages')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.responseTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.responseTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.processTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.processTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.cpuTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.cpuTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['queueStats.nowpWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.nowpWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.dialogWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.dialogWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.updateWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.updateWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.enqueueWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.enqueueWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.btcWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.btcWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.spoolWait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.spoolWait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['versionstats.version750'],
    labels: [t('in-sap:dashboards.noOfVersion750')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['versionstats.version760'],
    labels: [t('in-sap:dashboards.noOfVersion760')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['versionstats.version780'],
    labels: [t('in-sap:dashboards.noOfVersion780')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['versionstats.versionOthers'],
    labels: [t('in-sap:dashboards.noOfVersionOthers')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['queueStats.update2Wait'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.update2Wait')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('userList', 'RESPTIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'CPUTIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'QUEUETIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'ROLLWAITTIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'IOWAITTIME', t('in-sap:dashboards.performanceStats'))
    ],
    labels: [
      t('in-sap:dashboards.responseTime'),
      t('in-sap:dashboards.cpuTime'),
      t('in-sap:dashboards.userListQueueTime'),
      t('in-sap:dashboards.userListRollWaitTime'),
      t('in-sap:dashboards.userListIOWaitTime')
    ],
    category: [t('in-sap:dashboards.performanceStats')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('combinedMetrics', 'totalCpuTimePerUser', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('combinedMetrics', 'totalIOWaitTimePerUser', t('in-sap:dashboards.performanceStats'))
    ],
    labels: [t('in-sap:dashboards.combinedCpuTime'), t('in-sap:dashboards.combinedIOWaitTime')],
    category: [t('in-sap:dashboards.combinedCpuMetrics')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [getDynamicMetricMatch('workprocessList', 'wpCPU', t('in-sap:dashboards.workProcessCpu'))],
    labels: [t('in-sap:dashboards.workProcessCpu')],
    category: [t('in-sap:dashboards.workprocessList')],
    min: 0,
    formatter: seconds.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('workprocessList', 'wpIStatus', t('in-sap:dashboards.workProcessStatus')),
      getDynamicMetricMatch('workprocessList', 'wpDumps', t('in-sap:dashboards.workProcessDumps')),
      getDynamicMetricMatch('workprocessList', 'wpIType', t('in-sap:dashboards.workProcessType')),
      getDynamicMetricMatch('workprocessList', 'wpRestart', t('in-sap:dashboards.workProcessRestart')),
      getDynamicMetricMatch('workprocessList', 'wpMutex', t('in-sap:dashboards.workProcessMutex'))
    ],
    labels: [
      t('in-sap:dashboards.workProcessStatus'),
      t('in-sap:dashboards.workProcessDumps'),
      t('in-sap:dashboards.workProcessType'),
      t('in-sap:dashboards.workProcessRestart'),
      t('in-sap:dashboards.workProcessMutex')
    ],
    category: [t('in-sap:dashboards.workprocessList')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('memoryStats', 'memSum', t('in-sap:dashboards.totalMemory')),
      getDynamicMetricMatch('memoryStats', 'privsum', t('in-sap:dashboards.heapMemory')),
      getDynamicMetricMatch('memoryStats', 'usedBytes', t('in-sap:dashboards.extendedUsedBytes')),
      getDynamicMetricMatch('memoryStats', 'maxBytes', t('in-sap:dashboards.maxBytes'))
    ],
    labels: [
      t('in-sap:dashboards.totalMemory'),
      t('in-sap:dashboards.heapMemory'),
      t('in-sap:dashboards.extendedUsedBytes'),
      t('in-sap:dashboards.maxBytes')
    ],
    category: [t('in-sap:dashboards.memoryStats')],
    min: 0,
    formatter: bytes.compact
  },

  {
    metrics: [
      getDynamicMetricMatch('databaseStats', 'dbRequestTime', t('in-sap:dashboards.dbRequestTime')),
      getDynamicMetricMatch('databaseStats', 'totalDbRequests', t('in-sap:dashboards.totalDbRequests')),
      getDynamicMetricMatch('databaseStats', 'totalDbCalls', t('in-sap:dashboards.totalDbCalls'))
    ],
    labels: [
      t('in-sap:dashboards.dbRequestTime'),
      t('in-sap:dashboards.totalDbRequests'),
      t('in-sap:dashboards.totalDbCalls')
    ],
    category: [t('in-sap:dashboards.databaseStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('lanMetricStats', 'inPackets', t('in-sap:dashboards.inPackets')),
      getDynamicMetricMatch('lanMetricStats', 'outPackets', t('in-sap:dashboards.outPackets')),
      getDynamicMetricMatch('lanMetricStats', 'inErrors', t('in-sap:dashboards.inErrors')),
      getDynamicMetricMatch('lanMetricStats', 'outErrors', t('in-sap:dashboards.outErrors')),
      getDynamicMetricMatch('lanMetricStats', 'collisions', t('in-sap:dashboards.collisions'))
    ],
    labels: [
      t('in-sap:dashboards.inPackets'),
      t('in-sap:dashboards.outPackets'),
      t('in-sap:dashboards.inErrors'),
      t('in-sap:dashboards.outErrors'),
      t('in-sap:dashboards.collisions')
    ],
    category: [t('in-sap:dashboards.lanMetricStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('diskHourDataStats', 'avgQueueLength', t('in-sap:dashboards.avgQueueLength')),
      getDynamicMetricMatch('diskHourDataStats', 'response', t('in-sap:dashboards.response')),
      getDynamicMetricMatch('diskHourDataStats', 'mbPerHour', t('in-sap:dashboards.mbPerHour')),
      getDynamicMetricMatch('diskHourDataStats', 'operationsPerHour', t('in-sap:dashboards.operationsPerHour'))
    ],
    labels: [
      t('in-sap:dashboards.avgQueueLength'),
      t('in-sap:dashboards.response'),
      t('in-sap:dashboards.mbPerHour'),
      t('in-sap:dashboards.operationsPerHour')
    ],
    category: [t('in-sap:dashboards.diskHourDataStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('diskHourDataStats', 'avgWaitTime', t('in-sap:dashboards.avgWaitTime'))],
    labels: [t('in-sap:dashboards.avgWaitTime')],
    category: [t('in-sap:dashboards.diskHourDataStats')],
    min: 0,
    formatter: seconds
  },
  {
    metrics: [
      getDynamicMetricMatch('diskSummaryStats', 'avgQueueLength', t('in-sap:dashboards.avgQueueLength')),
      getDynamicMetricMatch('diskSummaryStats', 'response', t('in-sap:dashboards.response')),
      getDynamicMetricMatch('diskSummaryStats', 'kbPerSec', t('in-sap:dashboards.kbPerSec')),
      getDynamicMetricMatch('diskSummaryStats', 'operationsPerSec', t('in-sap:dashboards.operationsPerSec'))
    ],
    labels: [
      t('in-sap:dashboards.avgQueueLength'),
      t('in-sap:dashboards.response'),
      t('in-sap:dashboards.kbPerSec'),
      t('in-sap:dashboards.operationsPerSec')
    ],
    category: [t('in-sap:dashboards.diskSummaryStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('diskSummaryStats', 'avgWaitTime', t('in-sap:dashboards.avgWaitTime'))],
    labels: [t('in-sap:dashboards.avgWaitTime')],
    category: [t('in-sap:dashboards.diskSummaryStats')],
    min: 0,
    formatter: seconds
  },
  {
    metrics: [
      getDynamicMetricMatch('httpMetricsStats', 'callTime', t('in-sap:dashboards.callTime')),
      getDynamicMetricMatch('httpMetricsStats', 'executionTime', t('in-sap:dashboards.executionTime')),
      getDynamicMetricMatch('httpMetricsStats', 'dataSendTime', t('in-sap:dashboards.dataSendTime')),
      getDynamicMetricMatch('httpMetricsStats', 'dataReceiveTime', t('in-sap:dashboards.dataReceiveTime')),
      getDynamicMetricMatch('httpMetricsStats', 'logonTime', t('in-sap:dashboards.logonTime'))
    ],
    labels: [
      t('in-sap:dashboards.callTime'),
      t('in-sap:dashboards.executionTime'),
      t('in-sap:dashboards.dataSendTime'),
      t('in-sap:dashboards.dataReceiveTime'),
      t('in-sap:dashboards.logonTime')
    ],
    category: [t('in-sap:dashboards.httpMetricsStats')],
    min: 0,
    formatter: seconds
  },
  {
    metrics: [getDynamicMetricMatch('httpMetricsStats', 'counter', t('in-sap:dashboards.counter'))],
    labels: [t('in-sap:dashboards.counter')],
    category: [t('in-sap:dashboards.httpMetricsStats')],
    min: 0,
    formatter: number
  }
];
