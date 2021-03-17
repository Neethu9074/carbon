/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmcloudVSI.averageCpuUsagePercent'),
    metric: 'average_cpu_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmcloudVSI.memoryUsagePercent'),
    metric: 'memory_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmcloudVSI.networkTraffic'),
    metric: 'network_in_bytes',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmcloudVSI.volumeAccessSize'),
    metric: 'volume_read_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
