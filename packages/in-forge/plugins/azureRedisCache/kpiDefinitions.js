/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.azureRedisCache.labelOperationsPerSecond'),
    metric: 'operationsPerSecond',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureRedisCache.labelEvictedKeys'),
    metric: 'evictedKeys',
    formatters: number.compact
  }
];
