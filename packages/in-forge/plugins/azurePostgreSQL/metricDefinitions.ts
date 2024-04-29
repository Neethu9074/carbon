/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  zeroDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'backup_storage_used',
      'storage_used',
      'storage_free',
      'logical_replication_delay_in_bytes',
      'network_bytes_egress',
      'network_bytes_ingress'
    ],
    labels: [
      t('in-forge:plugins.azurePostgreSQL.labelBackupStorageUsed'),
      t('in-forge:plugins.azurePostgreSQL.labelStorageUsed'),
      t('in-forge:plugins.azurePostgreSQL.labelStorageFree'),
      t('in-forge:plugins.azurePostgreSQL.labelLogicalReplicationDelayInBytes'),
      t('in-forge:plugins.azurePostgreSQL.labelNetworkBytesEgress'),
      t('in-forge:plugins.azurePostgreSQL.labelNetworkBytesIngress')
    ],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['cpu_percent', 'memory_percent', 'storage_percent'],
    labels: [
      t('in-forge:plugins.azurePostgreSQL.labelCpuPercent'),
      t('in-forge:plugins.azurePostgreSQL.labelMemoryPercent'),
      t('in-forge:plugins.azurePostgreSQL.labelStoragePercent')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['longest_query_time_sec'],
    labels: [t('in-forge:plugins.azurePostgreSQL.labelLongestQueryTimeSec')],
    formatter: seconds.fixedCompact,
    min: 0
  },
  {
    metrics: [
      'iops',
      'read_throughput',
      'write_throughput',
      'read_iops',
      'write_iops',
      'deadlocks',
      'active_connections',
      'connections_failed',
      'connections_succeeded'
    ],
    labels: [
      t('in-forge:plugins.azurePostgreSQL.labelIops'),
      t('in-forge:plugins.azurePostgreSQL.labelReadThroughput'),
      t('in-forge:plugins.azurePostgreSQL.labelWriteThroughput'),
      t('in-forge:plugins.azurePostgreSQL.labelReadIops'),
      t('in-forge:plugins.azurePostgreSQL.labelWriteIops'),
      t('in-forge:plugins.azurePostgreSQL.labelDeadlocks'),
      t('in-forge:plugins.azurePostgreSQL.labelActiveConnections'),
      t('in-forge:plugins.azurePostgreSQL.labelConnectionsFailed'),
      t('in-forge:plugins.azurePostgreSQL.labelConnectionsSucceeded')
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];
