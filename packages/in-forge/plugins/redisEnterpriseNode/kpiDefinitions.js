/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRateZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.redisEnterpriseNode.throughput'),
    metric: 'throughput',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.redisEnterpriseNode.cacheHitRate'),
    metric: 'hit_rate',
    formatter: hitRateZeroDecimalPlaces
  }
];
