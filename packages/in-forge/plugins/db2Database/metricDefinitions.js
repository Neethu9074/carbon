/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, millis, percentage, micros } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'databases.status',
      'databases.queries',
      'databases.connectionsCount',
      'databases.rowsRead',
      'databases.rowsReturned',
      'databases.commits',
      'databases.rollbacks',
      'databases.selectQueries',
      'databases.mergeQueries',
      'databases.ddlQueries',
      'databases.uidQueries',
      'databases.xQueries',
      'databases.staticQueries',
      'databases.dynamicQueries',
      'databases.failedQueries',
      'dbConfig',
      'dbmConfig',
      'lockWaits',
      'runstats',
      'reorg',
      'tablesizes',
      'uow'
    ],
    labels: [
      t('in-forge:plugins.db2Database.status'),
      t('in-forge:plugins.db2Database.allQueries'),
      t('in-forge:plugins.db2Database.connectionCount'),
      t('in-forge:plugins.db2Database.rowsRead'),
      t('in-forge:plugins.db2Database.rowsReturned'),
      t('in-forge:plugins.db2Database.commits'),
      t('in-forge:plugins.db2Database.rollbacks'),
      t('in-forge:plugins.db2Database.selects'),
      t('in-forge:plugins.db2Database.merges'),
      t('in-forge:plugins.db2Database.ddls'),
      t('in-forge:plugins.db2Database.uids'),
      t('in-forge:plugins.db2Database.xqueries'),
      t('in-forge:plugins.db2Database.staticQueries'),
      t('in-forge:plugins.db2Database.dynamicQueries'),
      t('in-forge:plugins.db2Database.failedQueries'),
      t('in-forge:plugins.db2Database.dbConfig'),
      t('in-forge:plugins.db2Database.dbConfigName'),
      t('in-forge:plugins.db2Database.value'),
      t('in-forge:plugins.db2Database.valueFlags'),
      t('in-forge:plugins.db2Database.deferredValue'),
      t('in-forge:plugins.db2Database.deferredValueFlags'),
      t('in-forge:plugins.db2Database.dbmConfig'),
      t('in-forge:plugins.db2Database.lockWaits'),
      t('in-forge:plugins.db2Database.hldApplicationHandle'),
      t('in-forge:plugins.db2Database.reqApplicationHandle'),
      t('in-forge:plugins.db2Database.lockWaitElapsedTime'),
      t('in-forge:plugins.db2Database.lockMode'),
      t('in-forge:plugins.db2Database.lockModeRequested'),
      t('in-forge:plugins.db2Database.reqStmtText'),
      t('in-forge:plugins.db2Database.dashboard.runstats'),
      t('in-forge:plugins.db2Database.objName'),
      t('in-forge:plugins.db2Database.startTime'),
      t('in-forge:plugins.db2Database.endTime'),
      t('in-forge:plugins.db2Database.durationSec'),

      t('in-forge:plugins.db2Database.reorg'),
      t('in-forge:plugins.db2Database.tabName'),
      t('in-forge:plugins.db2Database.tabSchema'),
      t('in-forge:plugins.db2Database.reorgStatus'),
      t('in-forge:plugins.db2Database.reorgCompletion'),
      t('in-forge:plugins.db2Database.reorgStart'),
      t('in-forge:plugins.db2Database.reorgEnd'),

      t('in-forge:plugins.db2Database.tablesizes'),
      t('in-forge:plugins.db2Database.tableName'),
      t('in-forge:plugins.db2Database.cardTab'),
      t('in-forge:plugins.db2Database.tabSizeKB'),
      t('in-forge:plugins.db2Database.tabSizeMB'),
      t('in-forge:plugins.db2Database.avgRowSize'),

      t('in-forge:plugins.db2Database.uow'),
      t('in-forge:plugins.db2Database.appHandle'),
      t('in-forge:plugins.db2Database.appName'),
      t('in-forge:plugins.db2Database.clientAppName'),
      t('in-forge:plugins.db2Database.applicationID'),
      t('in-forge:plugins.db2Database.numLockHeld'),
      t('in-forge:plugins.db2Database.tabSizeKB'),
      t('in-forge:plugins.db2Database.uowLogSpaceUsed'),
      t('in-forge:plugins.db2Database.uowExecTime'),
      t('in-forge:plugins.db2Database.clientIdleTimeMin')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'bufferpools.dataWrites',
      'bufferpools.dataPhysicalReads',
      'bufferpools.dataLogicalReads',
      'bufferpools.temporaryDataPhysicalReads',
      'bufferpools.temporaryDataLogicalReads'
    ],
    labels: [
      t('in-forge:plugins.db2Database.physicalWrites'),
      t('in-forge:plugins.db2Database.physicalReads'),
      t('in-forge:plugins.db2Database.logicalReads'),
      t('in-forge:plugins.db2Database.tempPhysicalReads'),
      t('in-forge:plugins.db2Database.tempLogicalReads')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.bufferPoolDataPages')]
  },
  {
    metrics: [
      'bufferpools.indexWrites',
      'bufferpools.indexPhysicalReads',
      'bufferpools.indexLogicalReads',
      'bufferpools.temporaryIndexPhysicalRead',
      'bufferpools.temporaryIndexLogicalReads'
    ],
    labels: [
      t('in-forge:plugins.db2Database.physicalWrites'),
      t('in-forge:plugins.db2Database.physicalReads'),
      t('in-forge:plugins.db2Database.logicalReads'),
      t('in-forge:plugins.db2Database.tempPhysicalReads'),
      t('in-forge:plugins.db2Database.tempLogicalReads')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.bufferPoolIndexPages')]
  },
  {
    metrics: [
      'bufferpools.xdaDataWrites',
      'bufferpools.xdaDataPhysicalReads',
      'bufferpools.xdaDataLogicalReads',
      'bufferpools.temporaryXdaDataPhysicalReads',
      'bufferpools.temporaryXdaDataLogicalReads'
    ],
    labels: [
      t('in-forge:plugins.db2Database.physicalWrites'),
      t('in-forge:plugins.db2Database.physicalReads'),
      t('in-forge:plugins.db2Database.logicalReads'),
      t('in-forge:plugins.db2Database.tempPhysicalReads'),
      t('in-forge:plugins.db2Database.tempLogicalReads')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.bufferPoolXda')]
  },
  {
    metrics: ['bufferpools.physicalReadTime', 'bufferpools.physicalWriteTime'],
    labels: [
      t('in-forge:plugins.db2Database.bufferPoolReadTime'),
      t('in-forge:plugins.db2Database.bufferPoolWriteTime')
    ],
    min: 0,
    formatter: millis,
    category: [t('in-forge:plugins.db2Database.bufferPoolTime')]
  },
  {
    metrics: ['logs.available', 'logs.used', 'logs.secLogsUsed', 'logs.logUsedTop'],
    labels: [
      t('in-forge:plugins.db2Database.logsAvailable'),
      t('in-forge:plugins.db2Database.logsUsed'),
      t('in-forge:plugins.db2Database.logsecLogsUsed'),
      t('in-forge:plugins.db2Database.loglogUsedTop')
    ],
    min: 0,
    formatter: bytes.detailed,
    category: [t('in-forge:plugins.db2Database.logSpace')]
  },
  {
    metrics: ['logs.secLogsAlloc'],
    labels: [t('in-forge:plugins.db2Database.logsecLogsAlloc')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.logSpace')]
  },
  {
    metrics: ['logs.readsIO', 'logs.writesIO'],
    labels: [t('in-forge:plugins.db2Database.logIoReads'), t('in-forge:plugins.db2Database.logIoWrites')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.logIo')]
  },
  {
    metrics: ['logs.reads', 'logs.writes'],
    labels: [t('in-forge:plugins.db2Database.logReads'), t('in-forge:plugins.db2Database.logWrites')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.log')]
  },
  {
    metrics: ['logs.readTime', 'logs.writeTime'],
    labels: [
      t('in-forge:plugins.db2Database.dashboard.readTime'),
      t('in-forge:plugins.db2Database.dashboard.writeTime')
    ],
    min: 0,
    formatter: micros.detailed,
    category: [t('in-forge:plugins.db2Database.log')]
  },
  {
    metrics: ['logs.bufferFull', 'logs.dataInBuffer'],
    labels: [t('in-forge:plugins.db2Database.logbufferFull'), t('in-forge:plugins.db2Database.logdataInBuffer')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.log')]
  },
  {
    metrics: ['logs.diskReads', 'logs.totalReads', 'logs.buffReads'],
    labels: [
      t('in-forge:plugins.db2Database.logdiskReads'),
      t('in-forge:plugins.db2Database.logtotalReads'),
      t('in-forge:plugins.db2Database.logbuffReads')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.log')]
  },
  {
    metrics: ['logs.appIdXact', 'logs.firstActive', 'logs.lastActive', 'logs.currentActive'],
    labels: [
      t('in-forge:plugins.db2Database.logappIdXact'),
      t('in-forge:plugins.db2Database.logfirstActive'),
      t('in-forge:plugins.db2Database.loglastActive'),
      t('in-forge:plugins.db2Database.logcurrentActive')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.log')]
  },
  {
    metrics: [
      getDynamicMetricMatch('containers', 'totalSize', t('in-forge:plugins.db2Database.Container')),
      getDynamicMetricMatch('containers', 'usedSize', t('in-forge:plugins.db2Database.Container'))
    ],
    labels: [t('in-forge:plugins.db2Database.fileSystemSize'), t('in-forge:plugins.db2Database.fileSystemUsed')],
    category: [t('in-forge:plugins.db2Database.containers')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('containers', 'pagesRead', t('in-forge:plugins.db2Database.Container')),
      getDynamicMetricMatch('containers', 'pagesWritten', t('in-forge:plugins.db2Database.Container'))
    ],
    labels: [t('in-forge:plugins.db2Database.pagesRead'), t('in-forge:plugins.db2Database.pagesWritten')],
    category: [t('in-forge:plugins.db2Database.containers')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('containers', 'poolReadTime', t('in-forge:plugins.db2Database.Container')),
      getDynamicMetricMatch('containers', 'poolWriteTime', t('in-forge:plugins.db2Database.Container'))
    ],
    labels: [t('in-forge:plugins.db2Database.poolReadTime'), t('in-forge:plugins.db2Database.poolWriteTime')],
    category: [t('in-forge:plugins.db2Database.containers')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['topqueriesstats.topQueriesCount'],
    labels: [t('in-forge:plugins.db2Database.topQueriesCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['elapsedTime.queryCount'],
    labels: [t('in-forge:plugins.db2Database.queryCount')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.db2Database.elapsedTime')]
  },
  {
    metrics: [
      'dbmconfigusage.omsCons',
      'dbmconfigusage.omsConsExec',
      'dbmconfigusage.agentHighWmark',
      'dbmconfigusage.coordAgentsHighWmark',
      'dbmconfigusage.agentCreatedVSReused'
    ],
    labels: [
      t('in-forge:plugins.db2Database.omsCons'),
      t('in-forge:plugins.db2Database.omsConsExec'),
      t('in-forge:plugins.db2Database.agentHighWmark'),
      t('in-forge:plugins.db2Database.coordAgentsHighWmark'),
      t('in-forge:plugins.db2Database.agentCreatedVSReused')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'workloadstats.appCommits',
      'workloadstats.appRollback',
      'workloadstats.lockTimeouts',
      'workloadstats.deadlocks'
    ],
    labels: [
      t('in-forge:plugins.db2Database.appCommits'),
      t('in-forge:plugins.db2Database.appRollback'),
      t('in-forge:plugins.db2Database.lockTimeouts'),
      t('in-forge:plugins.db2Database.deadlocks')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'workloadstats.totalRequestTime',
      'workloadstats.totalWaitTime',
      'workloadstats.totalNetTime',
      'workloadstats.totalIOTime'
    ],
    labels: [
      t('in-forge:plugins.db2Database.totalRequestTime'),
      t('in-forge:plugins.db2Database.totalWaitTime'),
      t('in-forge:plugins.db2Database.totalNetTime'),
      t('in-forge:plugins.db2Database.totalIOTime')
    ],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'rowsRead', t('in-forge:plugins.db2Database.dashboard.toptotalcpu')),
      getDynamicMetricMatch('toptotalstmts', 'numExecutions', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [t('in-forge:plugins.db2Database.rowsRead'), t('in-forge:plugins.db2Database.numExecutions')],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'pctTotRr', t('in-forge:plugins.db2Database.dashboard.toptotalcpu')),
      getDynamicMetricMatch('toptotalstmts', 'pctTotCpu', t('in-forge:plugins.db2Database.dashboard.toptotalcpu')),
      getDynamicMetricMatch('toptotalstmts', 'pctNumExec', t('in-forge:plugins.db2Database.dashboard.toptotalcpu')),
      getDynamicMetricMatch('toptotalstmts', 'pctStmtExecTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [
      t('in-forge:plugins.db2Database.pctTotRr'),
      t('in-forge:plugins.db2Database.pctTotCpu'),
      t('in-forge:plugins.db2Database.pctNumExec'),
      t('in-forge:plugins.db2Database.pctStmtExecTime')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    max: 100,
    formatter: percentage.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'stmtExecTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [t('in-forge:plugins.db2Database.stmtExecTime')],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'totalCpuTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [t('in-forge:plugins.db2Database.totalCpuTime')],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: micros
  },
  {
    metrics: [
      getDynamicMetricMatch('logdiskwait', 'totalActTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch('logdiskwait', 'totalActWaitTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch('logdiskwait', 'logDiskWaitTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait'))
    ],
    labels: [
      t('in-forge:plugins.db2Database.totalActTime'),
      t('in-forge:plugins.db2Database.totalActWaitTime'),
      t('in-forge:plugins.db2Database.logDiskWaitTime')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.logdiskwait')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'logdiskwait',
        'logDiskWaitsTotal',
        t('in-forge:plugins.db2Database.dashboard.logdiskwait')
      ),
      getDynamicMetricMatch('logdiskwait', 'logBufferWaitTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait'))
    ],
    labels: [t('in-forge:plugins.db2Database.logDiskWaitsTotal'), t('in-forge:plugins.db2Database.logBufferWaitTime')],
    category: [t('in-forge:plugins.db2Database.dashboard.logdiskwait')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('logdiskwait', 'pctTotActTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch('logdiskwait', 'pctTotalActWt', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch(
        'logdiskwait',
        'pctDiskWtTotalExec',
        t('in-forge:plugins.db2Database.dashboard.logdiskwait')
      ),
      getDynamicMetricMatch('logdiskwait', 'pctLogBufWt', t('in-forge:plugins.db2Database.dashboard.logdiskwait'))
    ],
    labels: [
      t('in-forge:plugins.db2Database.pctTotActTime'),
      t('in-forge:plugins.db2Database.pctTotalActWt'),
      t('in-forge:plugins.db2Database.pctDiskWtTotalExec'),
      t('in-forge:plugins.db2Database.pctLogBufWt')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.logdiskwait')],
    min: 0,
    max: 100,
    formatter: percentage.detailed
  },
  {
    metrics: [
      'agentstatus.total',
      'agentstatus.uowWaiting',
      'agentstatus.uowExecuting',
      'agentstatus.lockWait',
      'agentstatus.lockEscalation',
      'agentstatus.other'
    ],
    labels: [
      t('in-forge:plugins.db2Database.total'),
      t('in-forge:plugins.db2Database.uowWaiting'),
      t('in-forge:plugins.db2Database.uowExecuting'),
      t('in-forge:plugins.db2Database.lockWait'),
      t('in-forge:plugins.db2Database.lockEscalation'),
      t('in-forge:plugins.db2Database.other')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('tablespaceutil', 'totalSize', t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil')),
      getDynamicMetricMatch('tablespaceutil', 'usedSpace', t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil')),
      getDynamicMetricMatch('tablespaceutil', 'freeSpace', t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil'))
    ],
    labels: [
      t('in-forge:plugins.db2Database.totalSize'),
      t('in-forge:plugins.db2Database.usedSpace'),
      t('in-forge:plugins.db2Database.freeSpace')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil')],
    min: 0,
    formatter: bytes.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'tablespaceutil',
        'spaceUtilPercent',
        t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil')
      )
    ],
    labels: [t('in-forge:plugins.db2Database.spaceUtilPercent')],
    category: [t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil')],
    min: 0,
    max: 100,
    formatter: percentage.detailed
  },
  {
    metrics: [
      'hadrmetrics.sockSendBufReq',
      'hadrmetrics.sockSendBufActual',
      'hadrmetrics.sockRecBufReq',
      'hadrmetrics.sockRecvBufAct'
    ],
    labels: [
      t('in-forge:plugins.db2Database.sockSendBufReq'),
      t('in-forge:plugins.db2Database.sockSendBufActual'),
      t('in-forge:plugins.db2Database.sockRecBufReq'),
      t('in-forge:plugins.db2Database.sockRecvBufAct')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['hadrmetrics.timeSinceLastRecv', 'hadrmetrics.logHadrWaitCur', 'hadrmetrics.logHadrWaitTime'],
    labels: [
      t('in-forge:plugins.db2Database.timeSinceLastRecv'),
      t('in-forge:plugins.db2Database.logHadrWaitCur'),
      t('in-forge:plugins.db2Database.logHadrWaitTime')
    ],
    min: 0,
    formatter: millis
  }
];
