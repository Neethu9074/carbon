/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'avg_requests',
    label: t('in-forge:plugins.solrCloudCluster.averageRequests'),
    min: 0,
    formatter: number
  },
  {
    metric: 'avg_time_request',
    label: t('in-forge:plugins.solrCloudCluster.averageRequestTime'),
    min: 0,
    formatter: number
  },
  {
    metric: 'hitratio',
    label: t('in-forge:plugins.solrCloudCluster.hitRate'),
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['lookups', 'inserts', 'errors', 'timeouts', 'evictions'],
    labels: [
      t('in-forge:plugins.solrCloudCluster.lookups'),
      t('in-forge:plugins.solrCloudCluster.inserts'),
      t('in-forge:plugins.solrCloudCluster.errors'),
      t('in-forge:plugins.solrCloudCluster.timeouts'),
      t('in-forge:plugins.solrCloudCluster.evictions')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['docs_added', 'docs_pending'],
    labels: [
      t('in-forge:plugins.solrCloudCluster.documentsAddedMetricDef'),
      t('in-forge:plugins.solrCloudCluster.documentsPendingMetricDef')
    ],
    min: 0,
    formatter: number
  }
];
