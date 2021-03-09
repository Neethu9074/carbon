/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.sapHana.cpuUsageKpiLabel'),
    metric: 'stats.cpuUsage',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.sapHana.usedMemory'),
    metric: 'stats.usedMemory',
    formatter: bytesTwoDecimalPlaces
  }
];
