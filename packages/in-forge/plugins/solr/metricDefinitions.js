/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('core_stats', 'avg_requests', 'Core'),
    label: t('in-forge:plugins.solr.averageRequests'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'avg_time_request', 'Core'),
    label: t('in-forge:plugins.solr.averageRequestTime'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'lookups', 'Core'),
    label: t('in-forge:plugins.solr.lookups'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'hitratio', 'Core'),
    label: t('in-forge:plugins.solr.hitRate'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'inserts', 'Core'),
    label: t('in-forge:plugins.solr.inserts'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'evictions', 'Core'),
    label: t('in-forge:plugins.solr.evictions'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'errors', 'Core'),
    label: t('in-forge:plugins.solr.errors'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'timeouts', 'Core'),
    label: t('in-forge:plugins.solr.timeouts'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'docs_added', 'Core'),
    label: t('in-forge:plugins.solr.documentsAdded'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'docs_pending', 'Core'),
    label: t('in-forge:plugins.solr.documentsPending'),
    category: [t('in-forge:plugins.solr.cores')],
    min: 0,
    formatter: number
  },
  {
    metric: 'hitratio',
    label: t('in-forge:plugins.solr.solrHitRatio'),
    min: 0,
    formatter: number
  },
  {
    metric: 'evictions',
    label: t('in-forge:plugins.solr.solrEvictions'),
    min: 0,
    formatter: number
  }
];
