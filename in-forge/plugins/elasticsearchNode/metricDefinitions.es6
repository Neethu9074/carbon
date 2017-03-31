import { siMultiplyPrefix, siPrefix, number, millis, bytes, ms } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['indices.query_latency'],
    labels: ['Latency'],
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
    labels: ['Number Of Queries', 'Indices', 'Active', 'Active Primary', 'Overall Documents', 'Added', 'Removed'],
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['indices.refresh_count', 'indices.flush_count', 'indices.segment_count'],
    labels: ['Refresh Count', 'Flush Count', 'Segments'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metrics: ['indices.refresh_time', 'indices.flush_time'],
    labels: ['Refresh Time', 'Flush Time'],
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
      'Search',
      'Index',
      'Bulk',
      'Merge',
      'Flush',
      'Get',
      'Management',
      'Refresh',
      'Search',
      'Index',
      'Bulk',
      'Get',
      'Search',
      'Index',
      'Bulk',
      'Merge',
      'Flush',
      'Get',
      'Management',
      'Refresh'
    ],
    min: 0,
    category: ['Threads'],
    formatter: number
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
