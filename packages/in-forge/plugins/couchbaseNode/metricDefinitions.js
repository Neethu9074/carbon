import { bytes, percentage, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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

const bucketMetricDefinitions = getBucketMetricDefinitions(BUCKET_METRICS_PREFIX);

export default nodeMetricDefinitions.concat(bucketMetricDefinitions);

export function getBucketMetricDefinitions(prefix) {
  return [
    {
      metric: getMetricMatch(prefix, 'curr_items'),
      label: 'Items',
      min: 0,
      formatter: number
    },
    {
      metric: getMetricMatch(prefix, 'mem_used_ratio'),
      label: 'Used memory (%)',
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getMetricMatch(prefix, 'couch_docs_actual_disk_size'),
      label: 'Used disk (bytes)',
      min: 0,
      formatter: bytes
    },
    {
      metric: getMetricMatch(prefix, 'ep_cache_miss_rate'),
      label: 'Cache miss (%)',
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getMetricMatch(prefix, 'couch_docs_fragmentation'),
      label: 'Fragmentation (%)',
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getMetricMatch(prefix, 'ops'),
      label: 'Operations per sec.',
      min: 0,
      formatter: number
    },
    {
      metric: getMetricMatch(prefix, 'cmd_get'),
      label: 'Gets per sec.',
      min: 0,
      formatter: number
    },
    {
      metric: getMetricMatch(prefix, 'cmd_set'),
      label: 'Sets per sec.',
      min: 0,
      formatter: number
    },
    {
      metric: getMetricMatch(prefix, 'vb_active_resident_items_ratio'),
      label: 'Active items resident in cache (%)',
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getMetricMatch(prefix, 'ep_bg_fetched'),
      label: 'Disk reads per sec.',
      min: 0,
      formatter: number
    },
    {
      metric: getMetricMatch(prefix, 'vb_active_eject'),
      label: 'Active items ejected per sec.',
      min: 0,
      formatter: number
    }
  ];
}
