/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('members', 'disk_io_utilization_percent_average_5m', 'Disk'),
    label: t('in-forge:plugins.ibmcloudEtcd.diskAverageIoPercentUtilization5M'),
    category: [t('in-forge:plugins.ibmcloudEtcd.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_iops_read_write_total', 'Disk'),
    label: t('in-forge:plugins.ibmcloudEtcd.diskIopsRWTotal'),
    category: [t('in-forge:plugins.ibmcloudEtcd.disk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', 'Disk'),
    label: t('in-forge:plugins.ibmcloudEtcd.diskTotalBytes'),
    category: [t('in-forge:plugins.ibmcloudEtcd.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', 'Disk'),
    label: t('in-forge:plugins.ibmcloudEtcd.diskUsedBytes'),
    category: [t('in-forge:plugins.ibmcloudEtcd.disk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', 'Disk'),
    label: t('in-forge:plugins.ibmcloudEtcd.diskUsedPercent'),
    category: [t('in-forge:plugins.ibmcloudEtcd.disk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', 'Memory'),
    label: t('in-forge:plugins.ibmcloudEtcd.memoryLimitBytes'),
    category: [t('in-forge:plugins.ibmcloudEtcd.memory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', 'Memory'),
    label: t('in-forge:plugins.ibmcloudEtcd.memoryUsedBytes'),
    category: [t('in-forge:plugins.ibmcloudEtcd.memory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', 'Memory'),
    label: t('in-forge:plugins.ibmcloudEtcd.memoryUsedPercent'),
    category: [t('in-forge:plugins.ibmcloudEtcd.memory')],
    min: 0,
    formatter: percentage
  }
];
