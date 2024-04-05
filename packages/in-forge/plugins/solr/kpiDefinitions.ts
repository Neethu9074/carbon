/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.solr.solrHitRatio'),
    metric: 'hitratio',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.solr.solrEvictionsKpiLabel'),
    metric: 'evictions',
    formatter: number.compact
  }
];
