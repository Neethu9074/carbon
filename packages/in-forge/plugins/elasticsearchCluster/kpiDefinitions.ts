/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { msZeroDecimalPlaces, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.elasticsearchCluster.latency'),
    metric: 'query_latency',
    formatter: msZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.elasticsearchCluster.indices'),
    metric: 'indices_count',
    formatter: withSiPrefixZeroDecimalPlaces
  }
];
