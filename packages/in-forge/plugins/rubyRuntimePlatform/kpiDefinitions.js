/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { kiloBytesZeroDecimalPlaces, msTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.rubyRuntimePlatform.rss'),
    metric: 'memory.rss_size',
    formatter: kiloBytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.rubyRuntimePlatform.timeSpentInGc'),
    metric: 'gc.totalTime',
    formatter: msTwoDecimalPlaces
  }
];
