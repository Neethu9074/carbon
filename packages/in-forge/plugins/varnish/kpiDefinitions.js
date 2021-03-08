/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { hitRateZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

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
