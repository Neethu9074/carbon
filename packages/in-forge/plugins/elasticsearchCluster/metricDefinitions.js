/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siMultiplyPrefix, siPrefix, number, bytes, ms } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['query_latency'],
    labels: [t('in-forge:plugins.elasticsearchCluster.latency')],
    min: 0,
    formatter: ms
  },
  {
    metrics: [
      'query_count',
      'indices_count',
      'active_shards',
      'active_primaryshards',
      'initializing_shards',
      'relocating_shards',
      'unassigned_shards',
      'document_count',
      'index_count',
      'deleted_count'
    ],
    labels: [
      t('in-forge:plugins.elasticsearchCluster.numberOfQueries'),
      t('in-forge:plugins.elasticsearchCluster.indices'),
      t('in-forge:plugins.elasticsearchCluster.active'),
      t('in-forge:plugins.elasticsearchCluster.activePrimary'),
      t('in-forge:plugins.elasticsearchCluster.initializing'),
      t('in-forge:plugins.elasticsearchCluster.relocating'),
      t('in-forge:plugins.elasticsearchCluster.unassigned'),
      t('in-forge:plugins.elasticsearchCluster.overallDocuments'),
      t('in-forge:plugins.elasticsearchCluster.added'),
      t('in-forge:plugins.elasticsearchCluster.removed')
    ],
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['indices_count', 'shards.node_active_shards', 'indices.document_count'],
    labels: [
      t('in-forge:plugins.elasticsearchCluster.indices'),
      t('in-forge:plugins.elasticsearchCluster.activeShards'),
      t('in-forge:plugins.elasticsearchCluster.documents')
    ],
    min: 0,
    category: [t('in-forge:plugins.elasticsearchCluster.nodes')],
    formatter: number
  },
  {
    metric: 'indices.store_size',
    label: t('in-forge:plugins.elasticsearchCluster.indicesSize'),
    min: 0,
    category: [t('in-forge:plugins.elasticsearchCluster.nodes')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('index', 'document_count', 'Index'),
    label: t('in-forge:plugins.elasticsearchCluster.documents'),
    category: [t('in-forge:plugins.elasticsearchCluster.index')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('index', 'deleted_count', 'Index'),
    label: t('in-forge:plugins.elasticsearchCluster.deletions'),
    category: [t('in-forge:plugins.elasticsearchCluster.index')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: 'node_count',
    label: t('in-forge:plugins.elasticsearchCluster.numberOfElasticsearchNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'cluster_status',
    label: t('in-forge:plugins.elasticsearchCluster.statusOfElasticsearchCluster'),
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('index', 'size', 'Index'),
    label: t('in-forge:plugins.elasticsearchCluster.size'),
    category: [t('in-forge:plugins.elasticsearchCluster.index')],
    min: 0,
    formatter: bytes
  }
];
