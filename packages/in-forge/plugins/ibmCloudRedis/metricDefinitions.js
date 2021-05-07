/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('members', 'cpu_used_percent', t('in-forge:plugins.ibmCloudRedis.titleCPU')),
    label: t('in-forge:plugins.ibmCloudRedis.cpuUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudRedis.titleCPU')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_io_utilization_percent_average_5m',
      t('in-forge:plugins.ibmCloudRedis.disk')
    ),
    label: t('in-forge:plugins.ibmCloudRedis.labelDiskIOPercent'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'iops_read_write_total', t('in-forge:plugins.ibmCloudRedis.disk')),
    label: t('in-forge:plugins.ibmCloudRedis.labelDiskIOPSTotal'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', t('in-forge:plugins.ibmCloudRedis.disk')),
    label: t('in-forge:plugins.ibmCloudRedis.labelDiskTotal'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', t('in-forge:plugins.ibmCloudRedis.disk')),
    label: t('in-forge:plugins.ibmCloudRedis.labelDiskUsed'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', t('in-forge:plugins.ibmCloudRedis.disk')),
    label: t('in-forge:plugins.ibmCloudRedis.diskUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelDisk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', t('in-forge:plugins.ibmCloudRedis.memory')),
    label: t('in-forge:plugins.ibmCloudRedis.labelMemoryLimit'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', t('in-forge:plugins.ibmCloudRedis.memory')),
    label: t('in-forge:plugins.ibmCloudRedis.labelMemoryUsed'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', t('in-forge:plugins.ibmCloudRedis.memory')),
    label: t('in-forge:plugins.ibmCloudRedis.memoryUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudRedis.labelMemory')],
    min: 0,
    formatter: percentage
  }
];
