/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, percentage, bytes, micros } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('members', 'connections', t('in-forge:plugins.ibmCloudMongoDb.connections')),
    label: t('in-forge:plugins.ibmCloudMongoDb.connections'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'cpu_used_percent', t('in-forge:plugins.ibmCloudMongoDb.cpu')),
    label: t('in-forge:plugins.ibmCloudMongoDb.cpuUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.cpu')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_io_utilization_percent_average_5m',
      t('in-forge:plugins.ibmCloudMongoDb.disk')
    ),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskIoUtilizationPercentAverage5m'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_iops_read_write_total', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskIopsReadWriteTotal'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_read_latency_mean', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskReadLatencyMean'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: micros
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskTotalBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_write_latency_mean', t('in-forge:plugins.ibmCloudMongoDb.disk')),
    label: t('in-forge:plugins.ibmCloudMongoDb.diskWriteLatencyMean'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'locks_time_acquiring_microseconds_W_average',
      t('in-forge:plugins.ibmCloudMongoDb.locks')
    ),
    label: t('in-forge:plugins.ibmCloudMongoDb.locksTimeAcquiringMicrosecondsWAverage'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.locks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'locks_time_acquiring_microseconds_total_average',
      t('in-forge:plugins.ibmCloudMongoDb.locks')
    ),
    label: t('in-forge:plugins.ibmCloudMongoDb.locksTimeAcquiringMicrosecondsTotalAverage'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.locks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', t('in-forge:plugins.ibmCloudMongoDb.memory')),
    label: t('in-forge:plugins.ibmCloudMongoDb.memoryLimitBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', t('in-forge:plugins.ibmCloudMongoDb.memory')),
    label: t('in-forge:plugins.ibmCloudMongoDb.memoryUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', t('in-forge:plugins.ibmCloudMongoDb.memory')),
    label: t('in-forge:plugins.ibmCloudMongoDb.memoryUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.blocks')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'oplog_gb_per_hour', t('in-forge:plugins.ibmCloudMongoDb.memory')),
    label: t('in-forge:plugins.ibmCloudMongoDb.oplogGbPerHour'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'oplog_used_bytes', t('in-forge:plugins.ibmCloudMongoDb.oplog')),
    label: t('in-forge:plugins.ibmCloudMongoDb.oplogUsedBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.oplog')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'oplog_used_bytes_percent', t('in-forge:plugins.ibmCloudMongoDb.oplog')),
    label: t('in-forge:plugins.ibmCloudMongoDb.oplogUsedBytesPercent'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.oplog')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'oplog_window_hours', t('in-forge:plugins.ibmCloudMongoDb.oplog')),
    label: t('in-forge:plugins.ibmCloudMongoDb.oplogWindowHours'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.oplog')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'page_faults', t('in-forge:plugins.ibmCloudMongoDb.memory')),
    label: t('in-forge:plugins.ibmCloudMongoDb.pageFaults'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'process_resident_memory_bytes',
      t('in-forge:plugins.ibmCloudMongoDb.memory')
    ),
    label: t('in-forge:plugins.ibmCloudMongoDb.processResidentMemoryBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'process_virtual_memory_bytes',
      t('in-forge:plugins.ibmCloudMongoDb.memory')
    ),
    label: t('in-forge:plugins.ibmCloudMongoDb.processVirtualMemoryBytes'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'replica_lag', t('in-forge:plugins.ibmCloudMongoDb.status')),
    label: t('in-forge:plugins.ibmCloudMongoDb.replicaLag'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.status')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'status', t('in-forge:plugins.ibmCloudMongoDb.status')),
    label: t('in-forge:plugins.ibmCloudMongoDb.status'),
    category: [t('in-forge:plugins.ibmCloudMongoDb.status')],
    min: 0,
    formatter: number
  }
];
