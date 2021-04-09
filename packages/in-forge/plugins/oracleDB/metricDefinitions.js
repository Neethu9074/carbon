/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, micros, millis, hitRate, percentage, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['stats.dbTime', 'stats.cpuTime', 'stats.sqlExecuteTime', 'stats.parseTime'],
    labels: [
      t('in-forge:plugins.oracleDB.dbTime'),
      t('in-forge:plugins.oracleDB.dbCpuTime'),
      t('in-forge:plugins.oracleDB.sqlExecuteTime'),
      t('in-forge:plugins.oracleDB.parseTime')
    ],
    formatter: micros,
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: ['stats.cpuTimeDbTimeRatio'],
    labels: [t('in-forge:plugins.oracleDB.dbCpuTimeDbTimeRatio')],
    min: 0
  },
  {
    formatter: millis,
    metrics: [
      'stats.timeWaited.userIO',
      'stats.timeWaited.other',
      'stats.timeWaited.systemIO',
      'stats.timeWaited.concurrency',
      'stats.timeWaited.scheduler',
      'stats.timeWaited.application',
      'stats.timeWaited.commit',
      'stats.timeWaited.configuration',
      'stats.timeWaited.administrative',
      'stats.timeWaited.network',
      'stats.timeWaited.queue'
    ],
    labels: [
      t('in-forge:plugins.oracleDB.userIO'),
      t('in-forge:plugins.oracleDB.other'),
      t('in-forge:plugins.oracleDB.systemIO'),
      t('in-forge:plugins.oracleDB.concurrency'),
      t('in-forge:plugins.oracleDB.scheduler'),
      t('in-forge:plugins.oracleDB.application'),
      t('in-forge:plugins.oracleDB.commit'),
      t('in-forge:plugins.oracleDB.configuration'),
      t('in-forge:plugins.oracleDB.administrative'),
      t('in-forge:plugins.oracleDB.network'),
      t('in-forge:plugins.oracleDB.queueing')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.sqlExecuteCount'],
    labels: [t('in-forge:plugins.oracleDB.sqlExecuteCount')],
    min: 0
  },
  {
    formatter: micros,
    metrics: ['stats.averageSqlExecuteTime'],
    labels: [t('in-forge:plugins.oracleDB.averageSqlExecutionTime')],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.hardParseCount', 'stats.totalParseCount'],
    labels: [t('in-forge:plugins.oracleDB.hardParseCount'), t('in-forge:plugins.oracleDB.totalParseCount')],
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: ['stats.softTotalParsesRatio', 'stats.executesWithoutParsesRatio'],
    labels: [
      t('in-forge:plugins.oracleDB.softTotalParseRatio'),
      t('in-forge:plugins.oracleDB.executesWithoutParsesRatio')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.userCalls',
      'stats.recursiveCalls',
      'stats.userCommits',
      'stats.userRollbacks',
      'stats.userLogOns'
    ],
    labels: [
      t('in-forge:plugins.oracleDB.userCalls'),
      t('in-forge:plugins.oracleDB.recursiveCalls'),
      t('in-forge:plugins.oracleDB.userCommits'),
      t('in-forge:plugins.oracleDB.userRollbacks'),
      t('in-forge:plugins.oracleDB.userLogOns')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.physicalReads', 'stats.sessionLogicalReads'],
    labels: [t('in-forge:plugins.oracleDB.physicalReads'), t('in-forge:plugins.oracleDB.sessionLogicalReads')],
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: ['stats.bufferCacheHitRatio'],
    labels: [t('in-forge:plugins.oracleDB.bufferCacheHitRatio')],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.activeUserSessions', 'stats.inactiveUserSessions', 'stats.backgroundSessions'],
    labels: [
      t('in-forge:plugins.oracleDB.activeUserSessions'),
      t('in-forge:plugins.oracleDB.inactiveUserSessions'),
      t('in-forge:plugins.oracleDB.backgroundSessions')
    ],
    min: 0
  },
  {
    max: 1,
    formatter: percentage,
    metrics: ['stats.usedSessionsRatio'],
    labels: [t('in-forge:plugins.oracleDB.sessionsSessionLimit')],
    min: 0
  },
  {
    formatter: bytes,
    metric: getDynamicMetricMatch('stats.tablespaceStats', 'usedSpace', t('in-forge:plugins.oracleDB.tablespace')),
    label: t('in-forge:plugins.oracleDB.usedSpace'),
    category: [t('in-forge:plugins.oracleDB.tablespaces')],
    min: 0
  },
  {
    formatter: percentage,
    metric: getDynamicMetricMatch('stats.tablespaceStats', 'usedPercent', t('in-forge:plugins.oracleDB.tablespace')),
    label: t('in-forge:plugins.oracleDB.usedPercent'),
    category: [t('in-forge:plugins.oracleDB.tablespaces')],
    min: 0,
    max: 1
  }
];
