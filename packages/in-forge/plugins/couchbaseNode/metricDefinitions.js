/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, percentage, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseNode/constants.js';

const nodeMetricDefinitions = [
  {
    metrics: ['node.mem_used', 'node.couch_docs_actual_disk_size'],
    labels: ['Used memory (bytes)', 'Used disk (bytes)'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['node.ep_diskqueue_fill', 'node.ep_diskqueue_drain', 'node.disk_write_queue'],
    labels: ['Items put to disk queue per sec.', 'Items written to disk per sec.', 'Items in disk write queue'],
    min: 0,
    formatter: number
  }
];

const bucketMetricDefinitions = getBucketMetricDefinitions(BUCKET_METRICS_PREFIX, 'Bucket Stats');

export default nodeMetricDefinitions.concat(bucketMetricDefinitions);

export function getBucketMetricDefinitions(prefix, category) {
  return [
    {
      metric: getDynamicMetricMatch(prefix, 'curr_items', 'Bucket'),
      label: 'Items',
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'mem_used_ratio', 'Bucket'),
      label: 'Used memory (%)',
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'couch_docs_actual_disk_size', 'Bucket'),
      label: 'Used disk (bytes)',
      category: [category],
      min: 0,
      formatter: bytes
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ep_cache_miss_rate', 'Bucket'),
      label: 'Cache miss (%)',
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'couch_docs_fragmentation', 'Bucket'),
      label: 'Fragmentation (%)',
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ops', 'Bucket'),
      label: 'Operations per sec.',
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'cmd_get', 'Bucket'),
      label: 'Gets per sec.',
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'cmd_set', 'Bucket'),
      label: 'Sets per sec.',
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'vb_active_resident_items_ratio', 'Bucket'),
      label: 'Active items resident in cache (%)',
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ep_bg_fetched', 'Bucket'),
      label: 'Disk reads per sec.',
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'vb_active_eject', 'Bucket'),
      label: 'Active items ejected per sec.',
      category: [category],
      min: 0,
      formatter: number
    }
  ];
}
