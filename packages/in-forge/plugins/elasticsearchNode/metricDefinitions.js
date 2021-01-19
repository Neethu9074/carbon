/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siMultiplyPrefix, siPrefix, number, millis, bytes, ms } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metric: 'cluster_health.status',
    label: 'Health status',
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('index', 'document_count', 'Index'),
      getDynamicMetricMatch('index', 'deleted_count', 'Index')
    ],
    labels: ['Documents', 'Deletions'],
    category: ['Index'],
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
      'Queries Current',
      'Queries Total',
      'Fetches Current',
      'Fetches Total',
      'Query Cache Evictions',
      'Request Cache Evictions',
      'Get Requests Total Count',
      'Get Requests Failed Count',
      'Indexing Operations Failed',
      'Current Merges Count'
    ],
    category: ['Index'],
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
    labels: ['Query Time', 'Fetch Time', 'Get Requests Time', 'Get Requests Failed Time', 'Total Merges Time'],
    category: ['Index'],
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
    labels: ['Size', 'Query Cache Memory', 'Request Cache Memory', 'Total Merges Size', 'Received', 'Sent'],
    category: ['Index'],
    min: 0,
    formatter: bytes
  }
];
