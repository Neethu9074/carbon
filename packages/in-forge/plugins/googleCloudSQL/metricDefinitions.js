/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['database.network.connections', 'database.available_for_failover'],
    labels: ['Database Network Connections', 'Database Available for Failover'],
    min: 0,
    category: ['Network'],
    formatter: number
  },
  {
    metrics: ['database.network.received_bytes_count', 'database.network.sent_bytes_count'],
    labels: ['Bytes received', 'Bytes sent'],
    min: 0,
    category: ['Network'],
    formatter: bytes.detailed
  },
  {
    metrics: ['database.cpu.reserved_cores', '"database.cpu.usage_time'],
    labels: ['Reserved Cores', 'Usage Time'],
    min: 0,
    category: ['CPU'],
    formatter: number
  },
  {
    metrics: ['cpu.used'],
    labels: ['CPU Utilization'],
    min: 0,
    category: ['CPU'],
    formatter: percentage.compact
  },
  {
    metrics: ['database.disk.bytes_used', 'database.disk.quota'],
    labels: ['Disk Used', 'Disk Quota'],
    min: 0,
    category: ['Disk'],
    formatter: bytes.detailed
  },
  {
    metrics: ['database.disk.write_ops_count'],
    labels: ['Disk Write Operations Count'],
    min: 0,
    category: ['Disk'],
    formatter: number
  },
  {
    metrics: ['database.disk.utilization'],
    labels: ['Disk Utilization'],
    min: 0,
    category: ['Disk'],
    formatter: percentage.compact
  },
  {
    metrics: ['database.memory.quota', 'database.memory.usage'],
    labels: ['Memory Quota', 'Memory Usage'],
    min: 0,
    category: ['Memory'],
    formatter: bytes.detailed
  },
  {
    metrics: ['memory.used'],
    labels: ['Memory Used'],
    min: 0,
    category: ['Memory'],
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
      'InnoDb Buffer Pool Package Dirty',
      'InnoDb Buffer Pool Package Free',
      'InnoDb Buffer Pool Package Total',
      'InnoDb Data Fsync',
      'InnoDb Os Log Fsync',
      'InnoDb Pages Read',
      'InnoDb Pages Written',
      'Queries',
      'Questions',
      'Sent Bytes Count',
      'Received Bytes Count',
      'Seconds Behind Master'
    ],
    min: 0,
    category: ['MySQL'],
    formatter: percentage.compact
  },
  {
    metrics: ['database.postgresql.num_backends', 'database.postgresql.transaction_count'],
    labels: ['Number of Backends', 'Transaction Count'],
    min: 0,
    category: ['PostgeSQL'],
    formatter: percentage.compact
  }
];
