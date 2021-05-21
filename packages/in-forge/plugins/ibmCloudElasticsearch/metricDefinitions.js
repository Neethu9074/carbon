/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('members', 'cpu_used_percent', t('in-forge:plugins.ibmCloudElasticsearch.cpu')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.cpu')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'disk_io_utilization_percent_average_5m',
      t('in-forge:plugins.ibmCloudElasticsearch.disk')
    ),
    label: t('in-forge:plugins.ibmCloudElasticsearch.diskIOPercent'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'iops_read_write_total', t('in-forge:plugins.ibmCloudElasticsearch.disk')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.iOPSTotal'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleDisk')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', t('in-forge:plugins.ibmCloudElasticsearch.disk')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.total'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', t('in-forge:plugins.ibmCloudElasticsearch.disk')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.used'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', t('in-forge:plugins.ibmCloudElasticsearch.disk')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleDisk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', t('in-forge:plugins.ibmCloudElasticsearch.memory')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.limit'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', t('in-forge:plugins.ibmCloudElasticsearch.memory')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.used'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', t('in-forge:plugins.ibmCloudElasticsearch.memory')),
    label: t('in-forge:plugins.ibmCloudElasticsearch.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudElasticsearch.titleMemory')],
    min: 0,
    formatter: percentage
  }
];
