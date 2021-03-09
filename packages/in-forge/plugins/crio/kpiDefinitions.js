/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.crio.cpuTotalUsage'),
    metric: 'cpu.total_usage',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.crio.cpuThrottlingCount'),
    metric: 'cpu.throttling_count',
    formatter: number.compact
  }
];
