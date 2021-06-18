/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('members', 'blocks_hit_rate', t('in-forge:plugins.ibmCloudPostgreSql.blocks')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.blocksHitRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.blocks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'blocks_read_rate', t('in-forge:plugins.ibmCloudPostgreSql.blocks')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.blocksReadRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.blocks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'buffers_backend_rate', t('in-forge:plugins.ibmCloudPostgreSql.buffers')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.buffersBackendRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.buffers')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'buffers_checkpoint_rate',
      t('in-forge:plugins.ibmCloudPostgreSql.buffers')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.buffersCheckpointRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.buffers')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'cache_hit_ratio', t('in-forge:plugins.ibmCloudPostgreSql.cache')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.cacheHitRatio'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.cache')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'cpu_used_percent', t('in-forge:plugins.ibmCloudPostgreSql.cpu')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.cpuUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.cpu')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'deadlocks_count', t('in-forge:plugins.ibmCloudPostgreSql.deadlocks')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.deadlocksCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.deadlocks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'deadlocks_rate', t('in-forge:plugins.ibmCloudPostgreSql.deadlocks')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.deadlocksRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.deadlocks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_io_utilization_percent_average_5m',
      t('in-forge:plugins.ibmCloudPostgreSql.disk')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskIoUtilizationPercentAverage5m'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_iops_read_write_total',
      t('in-forge:plugins.ibmCloudPostgreSql.disk')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskIopsReadWriteTotal'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_read_latency_mean', t('in-forge:plugins.ibmCloudPostgreSql.disk')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskReadLatencyMean'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', t('in-forge:plugins.ibmCloudPostgreSql.disk')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskTotalBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', t('in-forge:plugins.ibmCloudPostgreSql.disk')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', t('in-forge:plugins.ibmCloudPostgreSql.disk')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_write_latency_mean', t('in-forge:plugins.ibmCloudPostgreSql.disk')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.diskWriteLatencyMean'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', t('in-forge:plugins.ibmCloudPostgreSql.memory')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.memoryLimitBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', t('in-forge:plugins.ibmCloudPostgreSql.memory')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.memoryUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', t('in-forge:plugins.ibmCloudPostgreSql.memory')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.memoryUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'successful_archive_rate',
      t('in-forge:plugins.ibmCloudPostgreSql.storage')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.successfulArchiveRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.storage')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'temp_bytes_count', t('in-forge:plugins.ibmCloudPostgreSql.storage')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tempBytesCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.storage')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'total_connections', t('in-forge:plugins.ibmCloudPostgreSql.connections')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.totalConnections'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'transaction_commit_count',
      t('in-forge:plugins.ibmCloudPostgreSql.transactions')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.transactionCommitCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.transactions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'transaction_commit_rate',
      t('in-forge:plugins.ibmCloudPostgreSql.transactions')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.transactionCommitRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.transactions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'transaction_rollback_count',
      t('in-forge:plugins.ibmCloudPostgreSql.transactions')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.transactionRollbackCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.transactions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'transaction_rollback_rate',
      t('in-forge:plugins.ibmCloudPostgreSql.transactions')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.transactionRollbackRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.transactions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_deleted_count', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesDeletedCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_deleted_rate', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesDeletedRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_fetched_count', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesFetchedCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_fetched_rate', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesFetchedRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_inserted_count', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesInsertedCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_inserted_rate', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesInsertedRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_returned_rate', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesReturnedRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_updated_count', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesUpdatedCount'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'tuples_updated_rate', t('in-forge:plugins.ibmCloudPostgreSql.tuples')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.tuplesUpdatedRate'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.tuples')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'wal_used_bytes', t('in-forge:plugins.ibmCloudPostgreSql.storage')),
    label: t('in-forge:plugins.ibmCloudPostgreSql.walUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.storage')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'read_replica_replication_lag_bytes',
      t('in-forge:plugins.ibmCloudPostgreSql.replica')
    ),
    label: t('in-forge:plugins.ibmCloudPostgreSql.readReplicaReplicationLagBytes'),
    category: [t('in-forge:plugins.ibmCloudPostgreSql.replica')],
    min: 0,
    formatter: bytes
  }
];
