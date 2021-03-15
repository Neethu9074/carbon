/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['stats.usedMemory', 'stats.residentMemory'],
    labels: [t('in-forge:plugins.sapHana.usedMemory'), t('in-forge:plugins.sapHana.residentMemory')],
    formatter: number,
    min: 0
  },
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
      t('in-forge:plugins.sapHana.blocked'),
      t('in-forge:plugins.sapHana.blocking')
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
      t('in-forge:plugins.sapHana.blocked')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['stats.threadsJobWorkerCount', 'stats.threadsJobWorkerActiveCount', 'stats.threadsJobWorkerBlockedCount'],
    labels: [
      t('in-forge:plugins.sapHana.total'),
      t('in-forge:plugins.sapHana.active'),
      t('in-forge:plugins.sapHana.blocked')
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
      t('in-forge:plugins.sapHana.blocked')
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
  }
];
