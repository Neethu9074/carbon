/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['database.network.connections', 'database.available_for_failover'],
    labels: [
      t('in-forge:plugins.googleCloudSQL.databaseNetworkConnections'),
      t('in-forge:plugins.googleCloudSQL.databaseAvailableForFailover')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.network')],
    formatter: number
  },
  {
    metrics: ['database.network.received_bytes_count', 'database.network.sent_bytes_count'],
    labels: [t('in-forge:plugins.googleCloudSQL.bytesReceived'), t('in-forge:plugins.googleCloudSQL.bytesSent')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.network')],
    formatter: bytes.detailed
  },
  {
    metrics: ['database.cpu.reserved_cores', '"database.cpu.usage_time'],
    labels: [t('in-forge:plugins.googleCloudSQL.reservedCores'), t('in-forge:plugins.googleCloudSQL.usageTime')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.cpu')],
    formatter: number
  },
  {
    metrics: ['cpu.used'],
    labels: [t('in-forge:plugins.googleCloudSQL.cpuUtilization')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.cpu')],
    formatter: percentage.compact
  },
  {
    metrics: ['database.disk.bytes_used', 'database.disk.quota'],
    labels: [t('in-forge:plugins.googleCloudSQL.diskUsed'), t('in-forge:plugins.googleCloudSQL.diskQuota')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.disk')],
    formatter: bytes.detailed
  },
  {
    metrics: ['database.disk.write_ops_count'],
    labels: [t('in-forge:plugins.googleCloudSQL.diskWriteOperationsCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.disk')],
    formatter: number
  },
  {
    metrics: ['database.disk.utilization'],
    labels: [t('in-forge:plugins.googleCloudSQL.diskUtilization')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.disk')],
    formatter: percentage.compact
  },
  {
    metrics: ['database.memory.quota', 'database.memory.usage'],
    labels: [t('in-forge:plugins.googleCloudSQL.memoryQuota'), t('in-forge:plugins.googleCloudSQL.memoryUsage')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.memory')],
    formatter: bytes.detailed
  },
  {
    metrics: ['memory.used'],
    labels: [t('in-forge:plugins.googleCloudSQL.memoryUsed')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.memory')],
    formatter: percentage.compact
  },
  {
    metrics: [
      'database.mysql.innodb_buffer_pool_pages_dirty',
      'database.mysql.innodb_buffer_pool_pages_free',
      'database.mysql.innodb_buffer_pool_pages_total',
      'database.mysql.innodb_data_fsyncs',
      'database.mysql.innodb_os_log_fsyncs',
      'database.mysql.innodb_pages_read',
      'database.mysql.innodb_pages_written',
      'database.mysql.queries',
      'database.mysql.questions',
      'database.mysql.sent_bytes_count',
      'database.mysql.received_bytes_count',
      'database.mysql.replication.seconds_behind_master'
    ],
    labels: [
      t('in-forge:plugins.googleCloudSQL.innoDbBufferPoolPackageDirty'),
      t('in-forge:plugins.googleCloudSQL.innoDbBufferPoolPackageFree'),
      t('in-forge:plugins.googleCloudSQL.innoDbBufferPoolPackageTotal'),
      t('in-forge:plugins.googleCloudSQL.innoDbDataFsync'),
      t('in-forge:plugins.googleCloudSQL.innoDbOsLogFsync'),
      t('in-forge:plugins.googleCloudSQL.innoDbPagesRead'),
      t('in-forge:plugins.googleCloudSQL.innoDbPagesWritten'),
      t('in-forge:plugins.googleCloudSQL.queries'),
      t('in-forge:plugins.googleCloudSQL.questions'),
      t('in-forge:plugins.googleCloudSQL.sentBytesCount'),
      t('in-forge:plugins.googleCloudSQL.receivedBytesCount'),
      t('in-forge:plugins.googleCloudSQL.secondsBehindMaster')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.mySql')],
    formatter: percentage.compact
  },
  {
    metrics: ['database.postgresql.num_backends', 'database.postgresql.transaction_count'],
    labels: [
      t('in-forge:plugins.googleCloudSQL.numberOfBackends'),
      t('in-forge:plugins.googleCloudSQL.transactionCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudSQL.postgeSql')],
    formatter: percentage.compact
  }
];
