/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes, millis } from 'in-services/formatters/number';
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
      'runstats'
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
      t('in-forge:plugins.db2Database.durationSec')
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
    metrics: ['logs.available', 'logs.used'],
    labels: [t('in-forge:plugins.db2Database.logsAvailable'), t('in-forge:plugins.db2Database.logsUsed')],
    min: 0,
    formatter: bytes,
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
      'dbmconfigusage.agentHighWmark',
      'dbmconfigusage.coordAgentsHighWmark',
      'dbmconfigusage.agentCreatedVSReused'
    ],
    labels: [
      t('in-forge:plugins.db2Database.omsCons'),
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
    metrics: ['workloadstats.totalRequestTime', 'workloadstats.totalWaitTime', 'workloadstats.totalNetTime'],
    labels: [
      t('in-forge:plugins.db2Database.totalRequestTime'),
      t('in-forge:plugins.db2Database.totalWaitTime'),
      t('in-forge:plugins.db2Database.totalNetTime')
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
      getDynamicMetricMatch('toptotalstmts', 'pctNumExec', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [
      t('in-forge:plugins.db2Database.pctTotRr'),
      t('in-forge:plugins.db2Database.pctTotCpu'),
      t('in-forge:plugins.db2Database.pctNumExec')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'totalCpuTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu')),
      getDynamicMetricMatch('toptotalstmts', 'stmtExecTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [t('in-forge:plugins.db2Database.totalCpuTime'), t('in-forge:plugins.db2Database.stmtExecTime')],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('toptotalstmts', 'pctStmtExecTime', t('in-forge:plugins.db2Database.dashboard.toptotalcpu'))
    ],
    labels: [t('in-forge:plugins.db2Database.pctStmtExecTime')],
    category: [t('in-forge:plugins.db2Database.dashboard.toptotalcpu')],
    min: 0,
    formatter: number
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
    formatter: millis
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
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('logdiskwait', 'pctTotActTime', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch('logdiskwait', 'pctTotalActWt', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
      getDynamicMetricMatch('logdiskwait', 'pctLogDiskWt', t('in-forge:plugins.db2Database.dashboard.logdiskwait')),
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
      t('in-forge:plugins.db2Database.pctLogDiskWt'),
      t('in-forge:plugins.db2Database.pctDiskWtTotalExec'),
      t('in-forge:plugins.db2Database.pctLogBufWt')
    ],
    category: [t('in-forge:plugins.db2Database.dashboard.logdiskwait')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['uowqueriesstats.clientIdleTimeSec', 'uowqueriesstats.clientIdleTimeMin', 'uowqueriesstats.execTime'],
    labels: [
      t('in-forge:plugins.db2Database.clientIdleTimeSec'),
      t('in-forge:plugins.db2Database.clientIdleTimeMin'),
      t('in-forge:plugins.db2Database.clientIdleTimeMin')
    ],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['uowqueriesstats.logSpaceUsedKB', 'uowqueriesstats.logSpaceUsed'],
    labels: [t('in-forge:plugins.db2Database.logSpaceUsedKB'), t('in-forge:plugins.db2Database.logSpaceUsed')],
    min: 0,
    formatter: bytes
  }
];
