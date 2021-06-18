/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['activeQueries'],
    labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.activeQueries.count')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.activeQueries.name')]
  },
  {
    metrics: ['logicDatabaseReads', 'logicDatabaseWrites'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.reads'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.writes')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.name')]
  },
  {
    metrics: ['asyncDatabaseReads', 'asyncDatabaseWrites'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.reads'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.writes')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.name')]
  },
  {
    metrics: ['syncDatabaseReads', 'syncDatabaseWrites'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.reads'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.writes')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.name')]
  },
  {
    metrics: ['commits', 'rollbacks', 'miscellaneous'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.commits'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.rollbacks'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.miscellaneous')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.name')]
  },
  {
    metrics: ['planCachePlans'],
    labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCachePlans.count')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCachePlans.name')]
  },
  {
    metrics: ['planCacheSize', 'planCacheSizeLimit'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.size'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.limit')
    ],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.name')]
  },
  {
    metrics: ['planCacheSizeThreshold'],
    labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.threshold')],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.name')]
  },
  {
    metrics: ['cursorCount', 'cursorReuse'],
    labels: [
      t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.count'),
      t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.reuse')
    ],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.name')]
  }
];
