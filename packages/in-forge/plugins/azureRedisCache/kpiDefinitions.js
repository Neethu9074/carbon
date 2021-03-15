/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
