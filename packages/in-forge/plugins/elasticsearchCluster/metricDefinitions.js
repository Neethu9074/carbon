/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siMultiplyPrefix, siPrefix, number, bytes, ms } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['query_latency'],
    labels: ['Latency'],
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
      'Number Of Queries',
      'Indices',
      'Active',
      'Active Primary',
      'Initializing',
      'Relocating',
      'Unassigned',
      'Overall Documents',
      'Added',
      'Removed'
    ],
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['indices_count', 'shards.node_active_shards', 'indices.document_count'],
    labels: ['Indices', 'Active Shards', 'Documents'],
    min: 0,
    category: ['Nodes'],
    formatter: number
  },
  {
    metric: 'indices.store_size',
    label: 'Indices size',
    min: 0,
    category: ['Nodes'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('index', 'document_count', 'Index'),
    label: 'Documents',
    category: ['Index'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('index', 'deleted_count', 'Index'),
    label: 'Deletions',
    category: ['Index'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: 'node_count',
    label: 'Number of Elasticsearch Nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'cluster_status',
    label: 'Status of Elasticsearch Cluster',
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('index', 'size', 'Index'),
    label: 'Size',
    category: ['Index'],
    min: 0,
    formatter: bytes
  }
];
