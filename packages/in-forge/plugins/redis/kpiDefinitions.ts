/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hitRateZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.redis.throughput'),
    metric: 'throughput',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.redis.cacheHitRateKpiLabel'),
    metric: 'hit_rate',
    formatter: hitRateZeroDecimalPlaces
  }
];
