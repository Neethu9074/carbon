/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, millis, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('instances', 'app_container_age', t('in-forge:plugins.ibmCloudFoundry.instanceID')),
    label: t('in-forge:plugins.ibmCloudFoundry.age'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleContainer')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_disk_bytes_used', t('in-forge:plugins.ibmCloudFoundry.instanceID')),
    label: t('in-forge:plugins.ibmCloudFoundry.diskUsed'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'instances',
      'app_disk_bytes_total',
      t('in-forge:plugins.ibmCloudFoundry.instanceID')
    ),
    label: t('in-forge:plugins.ibmCloudFoundry.diskTotal'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'instances',
      'app_memory_bytes_used',
      t('in-forge:plugins.ibmCloudFoundry.instanceID')
    ),
    label: t('in-forge:plugins.ibmCloudFoundry.memoryUsed'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'instances',
      'app_memory_bytes_total',
      t('in-forge:plugins.ibmCloudFoundry.instanceID')
    ),
    label: t('in-forge:plugins.ibmCloudFoundry.memoryTotal'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_cpu_entitlement', t('in-forge:plugins.ibmCloudFoundry.instanceID')),
    label: t('in-forge:plugins.ibmCloudFoundry.cpuEntitlement'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleCpu')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'app_cpu_usage', t('in-forge:plugins.ibmCloudFoundry.instanceID')),
    label: t('in-forge:plugins.ibmCloudFoundry.cpuUsage'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleCpu')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('instances', 'cpu_utilization', t('in-forge:plugins.ibmCloudFoundry.instanceID')),
    label: t('in-forge:plugins.ibmCloudFoundry.percentCpuUtilization'),
    category: [t('in-forge:plugins.ibmCloudFoundry.titleCpu')],
    min: 0,
    formatter: percentage
  }
];
