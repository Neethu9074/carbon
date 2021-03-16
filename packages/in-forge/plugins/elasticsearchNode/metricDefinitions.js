/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siMultiplyPrefix, siPrefix, number, millis, bytes, ms } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['indices.query_latency'],
    labels: [t('in-forge:plugins.elasticsearchNode.latency')],
    min: 0,
    formatter: ms
  },
  {
    metrics: [
      'indices.query_count',
      'indices_count',
      'shards.node_active_shards',
      'shards.node_active_primary_shards',
      'indices.document_count',
      'indices.index_count',
      'indices.deleted_count'
    ],
    labels: [
      t('in-forge:plugins.elasticsearchNode.numberOfQueries'),
      t('in-forge:plugins.elasticsearchNode.indices'),
      t('in-forge:plugins.elasticsearchNode.active'),
      t('in-forge:plugins.elasticsearchNode.activePrimary'),
      t('in-forge:plugins.elasticsearchNode.overallDocuments'),
      t('in-forge:plugins.elasticsearchNode.added'),
      t('in-forge:plugins.elasticsearchNode.removed')
    ],
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['indices.refresh_count', 'indices.flush_count', 'indices.segment_count'],
    labels: [
      t('in-forge:plugins.elasticsearchNode.refreshCount'),
      t('in-forge:plugins.elasticsearchNode.flushCount'),
      t('in-forge:plugins.elasticsearchNode.segments')
    ],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metrics: ['indices.refresh_time', 'indices.flush_time'],
    labels: [t('in-forge:plugins.elasticsearchNode.refreshTime'), t('in-forge:plugins.elasticsearchNode.flushTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      'threads.search_active',
      'threads.index_active',
      'threads.bulk_active',
      'threads.merge_active',
      'threads.flush_active',
      'threads.get_active',
      'threads.management_active',
      'threads.refresh_active',
      'threads.search_rejected',
      'threads.index_rejected',
      'threads.bulk_rejected',
      'threads.get_rejected',
      'threads.search_queue',
      'threads.index_queue',
      'threads.bulk_queue',
      'threads.merge_queue',
      'threads.flush_queue',
      'threads.get_queue',
      'threads.management_queue',
      'threads.refresh_queue'
    ],
    labels: [
      t('in-forge:plugins.elasticsearchNode.search'),
      t('in-forge:plugins.elasticsearchNode.index'),
      t('in-forge:plugins.elasticsearchNode.bulk'),
      t('in-forge:plugins.elasticsearchNode.merge'),
      t('in-forge:plugins.elasticsearchNode.flush'),
      t('in-forge:plugins.elasticsearchNode.get'),
      t('in-forge:plugins.elasticsearchNode.management'),
      t('in-forge:plugins.elasticsearchNode.refresh'),
      t('in-forge:plugins.elasticsearchNode.search'),
      t('in-forge:plugins.elasticsearchNode.index'),
      t('in-forge:plugins.elasticsearchNode.bulk'),
      t('in-forge:plugins.elasticsearchNode.get'),
      t('in-forge:plugins.elasticsearchNode.search'),
      t('in-forge:plugins.elasticsearchNode.index'),
      t('in-forge:plugins.elasticsearchNode.bulk'),
      t('in-forge:plugins.elasticsearchNode.merge'),
      t('in-forge:plugins.elasticsearchNode.flush'),
      t('in-forge:plugins.elasticsearchNode.get'),
      t('in-forge:plugins.elasticsearchNode.management'),
      t('in-forge:plugins.elasticsearchNode.refresh')
    ],
    min: 0,
    category: [t('in-forge:plugins.elasticsearchNode.threads')],
    formatter: number
  },
  {
    metric: 'cluster_health.status',
    label: t('in-forge:plugins.elasticsearchNode.healthStatus'),
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('index', 'document_count', 'Index'),
      getDynamicMetricMatch('index', 'deleted_count', 'Index')
    ],
    labels: [t('in-forge:plugins.elasticsearchNode.documents'), t('in-forge:plugins.elasticsearchNode.deletions')],
    category: [t('in-forge:plugins.elasticsearchNode.index')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metrics: [
      getDynamicMetricMatch('index', 'query_current', 'Index'),
      getDynamicMetricMatch('index', 'query_total', 'Index'),
      getDynamicMetricMatch('index', 'fetch_current', 'Index'),
      getDynamicMetricMatch('index', 'fetch_count', 'Index'),
      getDynamicMetricMatch('index', 'query_cache_evictions', 'Index'),
      getDynamicMetricMatch('index', 'request_cache_evictions', 'Index'),
      getDynamicMetricMatch('index', 'get_count', 'Index'),
      getDynamicMetricMatch('index', 'missing_count', 'Index'),
      getDynamicMetricMatch('index', 'failed', 'Index'),
      getDynamicMetricMatch('index', 'merge_current', 'Index')
    ],
    labels: [
      t('in-forge:plugins.elasticsearchNode.queriesCurrent'),
      t('in-forge:plugins.elasticsearchNode.queriesTotal'),
      t('in-forge:plugins.elasticsearchNode.fetchesCurrent'),
      t('in-forge:plugins.elasticsearchNode.fetchesTotal'),
      t('in-forge:plugins.elasticsearchNode.queryCacheEvictions'),
      t('in-forge:plugins.elasticsearchNode.requestCacheEvictions'),
      t('in-forge:plugins.elasticsearchNode.getRequestsTotalCount'),
      t('in-forge:plugins.elasticsearchNode.getRequestsFailedCount'),
      t('in-forge:plugins.elasticsearchNode.indexingOperationsFailed'),
      t('in-forge:plugins.elasticsearchNode.currentMergesCount')
    ],
    category: [t('in-forge:plugins.elasticsearchNode.index')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('index', 'query_time', 'Index'),
      getDynamicMetricMatch('index', 'fetch_time', 'Index'),
      getDynamicMetricMatch('index', 'get_time', 'Index'),
      getDynamicMetricMatch('index', 'missing_time', 'Index'),
      getDynamicMetricMatch('index', 'merge_time', 'Index')
    ],
    labels: [
      t('in-forge:plugins.elasticsearchNode.queryTime'),
      t('in-forge:plugins.elasticsearchNode.fetchTime'),
      t('in-forge:plugins.elasticsearchNode.getRequestsTime'),
      t('in-forge:plugins.elasticsearchNode.getRequestsFailedTime'),
      t('in-forge:plugins.elasticsearchNode.totalMergesTime')
    ],
    category: [t('in-forge:plugins.elasticsearchNode.index')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('index', 'size', 'Index'),
      getDynamicMetricMatch('index', 'query_cache_size', 'Index'),
      getDynamicMetricMatch('index', 'request_cache_size', 'Index'),
      getDynamicMetricMatch('index', 'merge_size', 'Index'),
      'rx_count',
      'tx_count'
    ],
    labels: [
      t('in-forge:plugins.elasticsearchNode.size'),
      t('in-forge:plugins.elasticsearchNode.queryCacheMemory'),
      t('in-forge:plugins.elasticsearchNode.requestCacheMemory'),
      t('in-forge:plugins.elasticsearchNode.totalMergesSize'),
      t('in-forge:plugins.elasticsearchNode.received'),
      t('in-forge:plugins.elasticsearchNode.sent')
    ],
    category: [t('in-forge:plugins.elasticsearchNode.index')],
    min: 0,
    formatter: bytes
  }
];
