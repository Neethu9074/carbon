/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytesZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmVsi.labelAverageCPUUsedPercent'),
    metric: 'average_cpu_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmVsi.labelMemoryUsedPercent'),
    metric: 'memory_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmVsi.labelNetworkTraffic'),
    metric: 'network_in_bytes',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmVsi.labelVolumeRead'),
    metric: 'volume_read_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
