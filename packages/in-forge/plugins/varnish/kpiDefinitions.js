/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hitRateZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.varnish.labelReceivedClientRequestsUp'),
    metric: 'client_req',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.varnish.labelCacheHitRate'),
    metric: 'cache_hit_rate',
    formatter: hitRateZeroDecimalPlaces
  }
];
