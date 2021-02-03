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

export default [
  {
    metrics: ['totalCommittedTransactions'],
    labels: ['Committed Transactions'],
    min: 0,
    formatter: activity
  },
  {
    metric: 'max_conn_pct',
    label: 'Connection Usage',
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: 'total_active_connections',
    label: 'Total Active Connections',
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('databases', 'xact_commit', 'Database'),
    label: 'Committed transactions',
    category: ['Databases'],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'xact_rollback', 'Database'),
    label: 'Rolled back transactions',
    category: ['Databases'],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'blks_hit_rate', 'Database'),
    label: 'Cache Hit Ratio',
    category: ['Databases'],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('databases', 'conflicts', 'Database'),
    label: 'Standby Conflicts',
    category: ['Databases'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'idx_tup_read', 'Database'),
    label: 'Tuple read',
    category: ['Databases'],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'idx_tup_fetch', 'Database'),
    label: 'Tuple fetch',
    category: ['Databases'],
    min: 0,
    formatter: activity
  },
  {
    metric: getDynamicMetricMatch('databases', 'db_size', 'Database'),
    label: 'Database size',
    category: ['Databases'],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('databases', 'active_connections', 'Database'),
    label: 'Connection',
    category: ['Databases'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'replications_stats.replication_delay_bytes',
    label: 'Replication delay in bytes',
    category: ['Databases'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'replications_stats.replication_delay_seconds',
    label: 'Replication delay in seconds',
    category: ['Databases'],
    min: 0,
    formatter: seconds
  }
];
