/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsRds.cpuUsage'),
    category: [t('in-forge:plugins.awsRds.cpu')],
    formatter: percentage
  },
  {
    metric: 'cpu_credit_usage',
    label: t('in-forge:plugins.awsRds.cpuCreditUsage'),
    category: [t('in-forge:plugins.awsRds.cpu')],
    min: 0,
    formatter: number
  },
  {
    metric: 'cpu_credit_balance',
    label: t('in-forge:plugins.awsRds.cpuCreditBalance'),
    category: [t('in-forge:plugins.awsRds.cpu')],
    min: 0,
    formatter: number
  },
  {
    metric: 'burst_balance',
    label: t('in-forge:plugins.awsRds.burstBalance'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: 'db_connections',
    label: t('in-forge:plugins.awsRds.dbConnections'),
    category: [t('in-forge:plugins.awsRds.network')],
    min: 0,
    formatter: number
  },
  {
    metric: 'disk_queue_depth',
    label: t('in-forge:plugins.awsRds.diskQueueDepth'),
    category: [t('in-forge:plugins.awsRds.disk')],
    formatter: number
  },
  {
    metric: 'freeable_memory',
    label: t('in-forge:plugins.awsRds.freeableRam'),
    category: [t('in-forge:plugins.awsRds.memory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'free_storage_space',
    label: t('in-forge:plugins.awsRds.availableStorageSpace'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'replica_lag',
    label: t('in-forge:plugins.awsRds.replicaLag'),
    category: [],
    min: 0,
    formatter: millis
  },
  {
    metric: 'swap_usage',
    label: t('in-forge:plugins.awsRds.swapUsage'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'read_iops',
    label: t('in-forge:plugins.awsRds.readOps'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: 'write_iops',
    label: t('in-forge:plugins.awsRds.writeOps'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsRds.readLatency'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsRds.writeLatency'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsRds.readThroughput'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsRds.writeThroughput'),
    category: [t('in-forge:plugins.awsRds.disk')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'net_receive_throughput',
    label: t('in-forge:plugins.awsRds.receiveThroughput'),
    category: [t('in-forge:plugins.awsRds.network')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'net_transmit_throughput',
    label: t('in-forge:plugins.awsRds.transmitThroughput'),
    category: [t('in-forge:plugins.awsRds.network')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'volume_bytes_used_avg',
    label: t('in-forge:plugins.awsRds.volumeBytesUsed'),
    category: [t('in-forge:plugins.awsRds.network')],
    min: 0,
    formatter: bytes
  }
];
