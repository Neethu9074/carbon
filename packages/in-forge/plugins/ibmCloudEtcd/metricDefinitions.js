/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_io_utilization_percent_average_5m',
      t('in-forge:plugins.ibmCloudEtcd.disk')
    ),
    label: t('in-forge:plugins.ibmCloudEtcd.labelDiskIOPercent'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_iops_read_write_total', t('in-forge:plugins.ibmCloudEtcd.disk')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelDiskIOPSTotal'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', t('in-forge:plugins.ibmCloudEtcd.disk')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelDiskTotal'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', t('in-forge:plugins.ibmCloudEtcd.disk')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelDiskUsed'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', t('in-forge:plugins.ibmCloudEtcd.disk')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelDiskUsedPercent'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelDisk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', t('in-forge:plugins.ibmCloudEtcd.memory')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelMemoryLimit'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', t('in-forge:plugins.ibmCloudEtcd.memory')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelMemoryUsed'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', t('in-forge:plugins.ibmCloudEtcd.memory')),
    label: t('in-forge:plugins.ibmCloudEtcd.labelMemoryUsedCount'),
    category: [t('in-forge:plugins.ibmCloudEtcd.labelMemory')],
    min: 0,
    formatter: percentage
  }
];
