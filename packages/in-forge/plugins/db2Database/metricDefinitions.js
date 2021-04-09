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
      'databases.failedQueries'
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
      t('in-forge:plugins.db2Database.failedQueries')
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
  }
];
