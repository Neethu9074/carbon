/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, millis, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('instances', 'app_container_age', 'Container'),
    label: t('in-forge:plugins.ibmCloudFoundry.age'),
    category: ['Container'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_disk_bytes_used', 'Disk'),
    label: t('in-forge:plugins.ibmCloudFoundry.diskUsed'),
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_disk_bytes_total', 'Disk'),
    label: t('in-forge:plugins.ibmCloudFoundry.diskTotal'),
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_memory_bytes_used', 'Memory'),
    label: t('in-forge:plugins.ibmCloudFoundry.memoryUsed'),
    category: ['Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_memory_bytes_total', 'Memory'),
    label: t('in-forge:plugins.ibmCloudFoundry.memoryTotal'),
    category: ['Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_cpu_entitlement', 'Cpu'),
    label: t('in-forge:plugins.ibmCloudFoundry.cpuEntitlement'),
    category: ['CPU'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_cpu_usage', 'Cpu'),
    label: t('in-forge:plugins.ibmCloudFoundry.cpuUsage'),
    category: ['CPU'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'cpu_utilization', 'Cpu'),
    label: t('in-forge:plugins.ibmCloudFoundry.percentCpuUtilization'),
    category: ['CPU'],
    min: 0,
    formatter: percentage
  }
];
