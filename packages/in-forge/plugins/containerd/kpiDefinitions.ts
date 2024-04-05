/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.containerd.labelCPUTotalTime'),
    metric: 'cpu.total_usage',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.containerd.labelCPUThrottlingCount'),
    metric: 'cpu.throttling_count',
    formatter: number.compact
  }
];
