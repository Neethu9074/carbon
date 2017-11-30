import { siMultiplyPrefix, siPrefix, number, bytes, ms } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metric: getMetricMatch('index', 'document_count'),
    label: 'Documents',
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getMetricMatch('index', 'deleted_count'),
    label: 'Deletions',
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getMetricMatch('index', 'size'),
    label: 'Size',
    min: 0,
    formatter: bytes
  }
];
