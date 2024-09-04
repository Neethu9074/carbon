/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes, millis, seconds, kiloBytes, percentagePlain, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['workloadcounts.onHold'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.onHold')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workloadcounts.running'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.running')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workloadcounts.waiting'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.waiting')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workloadcounts.stopped'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.stopped')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workloadcounts.shutdown'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.shutdown')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workloadcounts.reserviert'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.reserved')],
    min: 0,
    formatter: number.compact
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
    formatter: number.compact
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
    formatter: number.compact
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
    metrics: ['swapmemory.freeMemory'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.freeMemory')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.physMem'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.physMem')],
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
    formatter: number.compact
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
      getDynamicMetricMatch('userList', 'PROCTI', t('in-forge:plugins.sapAbapInstanceSensor.processingTime')),
      getDynamicMetricMatch('userList', 'CPUTIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'QUEUETIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'ROLLWAITTIME', t('in-sap:dashboards.performanceStats')),
      getDynamicMetricMatch('userList', 'IOWAITTIME', t('in-sap:dashboards.performanceStats'))
    ],
    labels: [
      t('in-sap:dashboards.responseTime'),
      t('in-forge:plugins.sapAbapInstanceSensor.processingTime'),
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
      getDynamicMetricMatch('workprocessList', 'wpIndex', t('in-sap:dashboards.workProcessNumber')),
      getDynamicMetricMatch('workprocessList', 'wpIStatus', t('in-sap:dashboards.workProcessStatus')),
      getDynamicMetricMatch('workprocessList', 'wpDumps', t('in-sap:dashboards.workProcessDumps')),
      getDynamicMetricMatch('workprocessList', 'wpIType', t('in-sap:dashboards.workProcessType')),
      getDynamicMetricMatch('workprocessList', 'wpRestart', t('in-sap:dashboards.workProcessRestart')),
      getDynamicMetricMatch('workprocessList', 'wpMutex', t('in-sap:dashboards.workProcessMutex'))
    ],
    labels: [
      t('in-sap:dashboards.workProcessNumber'),
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
    metrics: [getDynamicMetricMatch('jobDetails', 'PRDHOURS', t('in-sap:dashboards.prdHours'))],
    labels: [t('in-sap:dashboards.prdHours')],
    category: [t('in-sap:dashboards.jobsInformation')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('jobDetails', 'PRDMINS', t('in-sap:dashboards.prdMins'))],
    labels: [t('in-sap:dashboards.prdMins')],
    category: [t('in-sap:dashboards.jobsInformation')],
    min: 0,
    formatter: minutes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('memoryStats', 'memSum', t('in-sap:dashboards.totalMemory')),
      getDynamicMetricMatch('memoryStats', 'privsum', t('in-sap:dashboards.privateMemory')),
      getDynamicMetricMatch('memoryStats', 'usedBytes', t('in-sap:dashboards.extendedUsedBytes')),
      getDynamicMetricMatch('memoryStats', 'maxBytes', t('in-sap:dashboards.maxBytes'))
    ],
    labels: [
      t('in-sap:dashboards.totalMemory'),
      t('in-sap:dashboards.privateMemory'),
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
      getDynamicMetricMatch('databaseStats', 'totalDbCalls', t('in-sap:dashboards.dbCalls'))
    ],
    labels: [
      t('in-sap:dashboards.dbRequestTime'),
      t('in-sap:dashboards.totalDbRequests'),
      t('in-sap:dashboards.dbCalls')
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
      getDynamicMetricMatch('diskSummaryStats', 'response', t('in-sap:dashboards.response'))
    ],
    labels: [t('in-sap:dashboards.avgQueueLength'), t('in-sap:dashboards.response')],
    category: [t('in-sap:dashboards.diskSummaryStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('diskSummaryStats', 'kbPerSec', t('in-sap:dashboards.transferKB')),
      getDynamicMetricMatch('diskSummaryStats', 'operationsPerSec', t('in-sap:dashboards.operations'))
    ],
    labels: [t('in-sap:dashboards.transferKB'), t('in-sap:dashboards.operations')],
    category: [t('in-sap:dashboards.diskSummaryStats')],
    min: 0,
    formatter: number.perSecond.compact
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
  },
  {
    metrics: [getDynamicMetricMatch('topProcessMetricStats', 'cpuTime', t('in-sap:dashboards.cpuTime'))],
    labels: [t('in-sap:dashboards.cpuTime')],
    category: [t('in-sap:dashboards.TopProcessList')],
    min: 0,
    formatter: seconds.detailed
  },
  {
    metrics: [getDynamicMetricMatch('topProcessMetricStats', 'resSize', t('in-sap:dashboards.resSize'))],
    labels: [t('in-sap:dashboards.resSize')],
    category: [t('in-sap:dashboards.TopProcessList')],
    min: 0,
    formatter: kiloBytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('abapdumpstats', 'E2E_SEVERITY', t('in-forge:plugins.sapAbapInstanceSensor.severity'))
    ],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.severity')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.abapdumpstats')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('gatewayBackendErrorLogs', 'error', t('in-forge:plugins.sapAbapInstanceSensor.errorCount'))
    ],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.errorCount')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.gatewayBackendEndErrorLogs')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('inboundDetails', 'successCount', t('in-forge:plugins.sapAbapInstanceSensor.success')),
      getDynamicMetricMatch(
        'inboundDetails',
        'readyToProcessCount',
        t('in-forge:plugins.sapAbapInstanceSensor.readyToProcess')
      ),
      getDynamicMetricMatch('inboundDetails', 'errorCount', t('in-forge:plugins.sapAbapInstanceSensor.error'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.success'),
      t('in-forge:plugins.sapAbapInstanceSensor.readyToProcess'),
      t('in-forge:plugins.sapAbapInstanceSensor.error')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.inBoundIdoc')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('outboundDetails', 'successCount', t('in-forge:plugins.sapAbapInstanceSensor.success')),
      getDynamicMetricMatch(
        'outboundDetails',
        'readyToProcessCount',
        t('in-forge:plugins.sapAbapInstanceSensor.readyToProcess')
      ),
      getDynamicMetricMatch('outboundDetails', 'errorCount', t('in-forge:plugins.sapAbapInstanceSensor.error'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.success'),
      t('in-forge:plugins.sapAbapInstanceSensor.readyToProcess'),
      t('in-forge:plugins.sapAbapInstanceSensor.error')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.outBoundIdoc')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('fioriCallMetrics', 'callTime', t('in-forge:plugins.sapAbapInstanceSensor.callTime')),
      getDynamicMetricMatch(
        'fioriCallMetrics',
        'executionTime',
        t('in-forge:plugins.sapAbapInstanceSensor.executionTime')
      )
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.callTime'),
      t('in-forge:plugins.sapAbapInstanceSensor.executionTime')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.callMetrics')],
    min: 0,
    formatter: millis.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('fioriCallMetrics', 'dataSend', t('in-forge:plugins.sapAbapInstanceSensor.dataSend')),
      getDynamicMetricMatch('fioriCallMetrics', 'dataReceive', t('in-forge:plugins.sapAbapInstanceSensor.dataReceived'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.dataSend'),
      t('in-forge:plugins.sapAbapInstanceSensor.dataReceived')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.pageFrequency')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('fileSystemStats', 'CAPACITY', t('in-forge:plugins.sapAbapInstanceSensor.capacity')),
      getDynamicMetricMatch('fileSystemStats', 'FREE', t('in-forge:plugins.sapAbapInstanceSensor.free'))
    ],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.capacity'), t('in-forge:plugins.sapAbapInstanceSensor.free')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.fileSystemMetrics')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'fileSystemStats',
        'USED_PERCENTAGE',
        t('in-forge:plugins.sapAbapInstanceSensor.usedPercentage')
      )
    ],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.usedPercentage')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.fileSystemMetrics')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('bufferMetrics', 'allocSize', t('in-forge:plugins.sapAbapInstanceSensor.allocSize')),
      getDynamicMetricMatch('bufferMetrics', 'availSize', t('in-forge:plugins.sapAbapInstanceSensor.availSize'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.allocSize'),
      t('in-forge:plugins.sapAbapInstanceSensor.availSize')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.bufferStats')],
    min: 0,
    formatter: bytes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('bufferMetrics', 'hitRatio', t('in-forge:plugins.sapAbapInstanceSensor.hitRatio')),
      getDynamicMetricMatch('bufferMetrics', 'dbQuality', t('in-forge:plugins.sapAbapInstanceSensor.dbQuality'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.hitRatio'),
      t('in-forge:plugins.sapAbapInstanceSensor.dbQuality')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.bufferStats')],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('bufferMetrics', 'insert', t('in-forge:plugins.sapAbapInstanceSensor.insert')),
      getDynamicMetricMatch('bufferMetrics', 'update', t('in-forge:plugins.sapAbapInstanceSensor.update')),
      getDynamicMetricMatch('bufferMetrics', 'delete', t('in-forge:plugins.sapAbapInstanceSensor.delete')),
      getDynamicMetricMatch('bufferMetrics', 'request', t('in-forge:plugins.sapAbapInstanceSensor.request')),
      getDynamicMetricMatch('bufferMetrics', 'hit', t('in-forge:plugins.sapAbapInstanceSensor.hit'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.insert'),
      t('in-forge:plugins.sapAbapInstanceSensor.update'),
      t('in-forge:plugins.sapAbapInstanceSensor.delete'),
      t('in-forge:plugins.sapAbapInstanceSensor.request'),
      t('in-forge:plugins.sapAbapInstanceSensor.hit')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.bufferStats')],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: [getDynamicMetricMatch('dbConnectionList', 'dbTime', t('in-forge:plugins.sapAbapInstanceSensor.dbTime'))],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.dbTime')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.dbConnection')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('dbConnectionList', 'totalCalls', t('in-forge:plugins.sapAbapInstanceSensor.calls'))
    ],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.calls')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.dbConnection')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('rfcCalls', 'call_Time', t('in-forge:plugins.sapAbapInstanceSensor.callTime')),
      getDynamicMetricMatch('rfcCalls', 'execution_Time', t('in-forge:plugins.sapAbapInstanceSensor.executionTime'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.callTime'),
      t('in-forge:plugins.sapAbapInstanceSensor.executionTime')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.rfcStats')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('rfcCalls', 'sendData', t('in-forge:plugins.sapAbapInstanceSensor.sentData')),
      getDynamicMetricMatch('rfcCalls', 'receiveData', t('in-forge:plugins.sapAbapInstanceSensor.receivedData'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.sentData'),
      t('in-forge:plugins.sapAbapInstanceSensor.receivedData')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.rfcStats')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('cpuMetricStats', 'usrTotal', t('in-forge:plugins.sapAbapInstanceSensor.userTotal')),
      getDynamicMetricMatch('cpuMetricStats', 'sysTotal', t('in-forge:plugins.sapAbapInstanceSensor.systemTotal')),
      getDynamicMetricMatch('cpuMetricStats', 'idleTotal', t('in-forge:plugins.sapAbapInstanceSensor.idleTotal'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.userTotal'),
      t('in-forge:plugins.sapAbapInstanceSensor.systemTotal'),
      t('in-forge:plugins.sapAbapInstanceSensor.idleTotal')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.cpuMetrics')],
    min: 0,
    formatter: percentagePlain.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('cpuMetricStats', 'intSec', t('in-forge:plugins.sapAbapInstanceSensor.interrupts')),
      getDynamicMetricMatch('cpuMetricStats', 'syscSec', t('in-forge:plugins.sapAbapInstanceSensor.systemCalls')),
      getDynamicMetricMatch('cpuMetricStats', 'csSec', t('in-forge:plugins.sapAbapInstanceSensor.contextSwitch'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.interrupts'),
      t('in-forge:plugins.sapAbapInstanceSensor.systemCalls'),
      t('in-forge:plugins.sapAbapInstanceSensor.contextSwitch')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.cpuCalls')],
    min: 0,
    formatter: number.perSecond.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('cpuMetricStats', 'loadAvg1', t('in-forge:plugins.sapAbapInstanceSensor.loadAvg1')),
      getDynamicMetricMatch('cpuMetricStats', 'loadAvg5', t('in-forge:plugins.sapAbapInstanceSensor.loadAvg5')),
      getDynamicMetricMatch('cpuMetricStats', 'loadAvg15', t('in-forge:plugins.sapAbapInstanceSensor.loadAvg15'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.loadAvg1'),
      t('in-forge:plugins.sapAbapInstanceSensor.loadAvg5'),
      t('in-forge:plugins.sapAbapInstanceSensor.loadAvg15')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.loadAverage')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [getDynamicMetricMatch('systemLogStats', 'count', t('in-forge:plugins.sapAbapInstanceSensor.count'))],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.count')],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.systemLogStatistics')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['swapmemory.usedMemory'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.usedMemory')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: ['cpuMetricStats.totalUtilization'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalUtilization')],
    min: 0,
    formatter: percentagePlain.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sapMetricsStats',
        'successLogins',
        t('in-forge:plugins.sapAbapInstanceSensor.successLogins')
      ),
      getDynamicMetricMatch('sapMetricsStats', 'failedLogins', t('in-forge:plugins.sapAbapInstanceSensor.failedLogins'))
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.successLogins'),
      t('in-forge:plugins.sapAbapInstanceSensor.failedLogins')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.userLogins')],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sapMetricsStats',
        'concernedSystemLogCount',
        t('in-forge:plugins.sapAbapInstanceSensor.severity1')
      ),
      getDynamicMetricMatch(
        'sapMetricsStats',
        'urgentSystemLogCount',
        t('in-forge:plugins.sapAbapInstanceSensor.severity2')
      )
    ],
    labels: [
      t('in-forge:plugins.sapAbapInstanceSensor.severity1'),
      t('in-forge:plugins.sapAbapInstanceSensor.severity2')
    ],
    category: [t('in-forge:plugins.sapAbapInstanceSensor.systemLogErrors')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      'workLoadStats.dialogResponseTime',
      'workLoadStats.updateResponseTime',
      'workLoadStats.spoolResponseTime',
      'workLoadStats.bckgrdResponseTime',
      'workLoadStats.enqueueResponseTime',
      'workLoadStats.update2ResponseTime',
      'workLoadStats.rfcResponseTime'
    ],
    labels: [
      t('in-sap:dashboards.dialogRespTime'),
      t('in-sap:dashboards.updateRespTime'),
      t('in-sap:dashboards.spoolRespTime'),
      t('in-sap:dashboards.bckgrdRespTime'),
      t('in-sap:dashboards.enqueueRespTime'),
      t('in-sap:dashboards.update2RespTime'),
      t('in-sap:dashboards.rfcRespTime')
    ],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      'workLoadStats.avgDialogResponseTime',
      'workLoadStats.avgUpdateResponseTime',
      'workLoadStats.avgSpoolResponseTime',
      'workLoadStats.avgBckgrdResponseTime',
      'workLoadStats.avgEnqueueResponseTime',
      'workLoadStats.avgUpdate2ResponseTime',
      'workLoadStats.avgRfcResponseTime'
    ],
    labels: [
      t('in-sap:dashboards.dialogRespTime'),
      t('in-sap:dashboards.updateRespTime'),
      t('in-sap:dashboards.spoolRespTime'),
      t('in-sap:dashboards.bckgrdRespTime'),
      t('in-sap:dashboards.enqueueRespTime'),
      t('in-sap:dashboards.update2RespTime'),
      t('in-sap:dashboards.rfcRespTime')
    ],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [getDynamicMetricMatch('updateErrorStats', 'noVariableMsgPart', t('in-sap:dashboards.noVariableMsgPart'))],
    labels: [t('in-sap:dashboards.noVariableMsgPart')],
    category: [t('in-sap:dashboards.updateError')],
    min: 0,
    formatter: number.compact
  }
];
