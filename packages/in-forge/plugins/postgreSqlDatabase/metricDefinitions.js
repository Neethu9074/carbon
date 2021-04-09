/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  activity,
  hitRate,
  number,
  seconds,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalCommittedTransactions'],
    labels: [t('in-forge:plugins.postgreSqlDatabase.committedTransactionsKpiLabel')],
    min: 0,
    formatter: activity
  },
  {
    metric: 'max_conn_pct',
    label: t('in-forge:plugins.postgreSqlDatabase.connectionUsage'),
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: 'total_active_connections',
    label: t('in-forge:plugins.postgreSqlDatabase.totalActiveConnections'),
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('databases', 'xact_commit', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.committedTransactions'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'xact_rollback', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.rolledBackTransactions'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'blks_hit_rate', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.cacheHitRatio'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('databases', 'conflicts', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.standbyConflicts'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'idx_tup_read', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.tupleRead'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'idx_tup_fetch', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.tupleFetch'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'db_size', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.databaseSize'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('databases', 'active_connections', t('in-forge:plugins.postgreSqlDatabase.database')),
    label: t('in-forge:plugins.postgreSqlDatabase.connection'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'replication_stats.replication_delay_bytes',
    label: t('in-forge:plugins.postgreSqlDatabase.replicationDelayInBytes'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'replication_stats.replication_delay_seconds',
    label: t('in-forge:plugins.postgreSqlDatabase.replicationDelayInSeconds'),
    category: [t('in-forge:plugins.postgreSqlDatabase.databases')],
    min: 0,
    formatter: seconds
  }
];
