/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseNode/constants.js';
import { bytes, percentage, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

const nodeMetricDefinitions = [
  {
    metrics: ['node.mem_used', 'node.couch_docs_actual_disk_size'],
    labels: [t('in-forge:plugins.couchbaseNode.labelUsedMemory'), t('in-forge:plugins.couchbaseNode.labelUsedDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['node.ep_diskqueue_fill', 'node.ep_diskqueue_drain', 'node.disk_write_queue'],
    labels: [
      t('in-forge:plugins.couchbaseNode.labelItemsPutToQueue'),
      t('in-forge:plugins.couchbaseNode.labelItemsWriteToDisk'),
      t('in-forge:plugins.couchbaseNode.labelItemsInQueue')
    ],
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
      label: t('in-forge:plugins.couchbaseNode.labelItems'),
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'mem_used_ratio', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelUsedMemoryP'),
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'couch_docs_actual_disk_size', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelUsedDisk'),
      category: [category],
      min: 0,
      formatter: bytes
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ep_cache_miss_rate', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelCacheMiss'),
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'couch_docs_fragmentation', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelFragmentation'),
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ops', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelOperationsPerSec'),
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'cmd_get', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelGetsPerSec'),
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'cmd_set', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelSetsPerSec'),
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'vb_active_resident_items_ratio', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelActiveItems'),
      category: [category],
      min: 0,
      max: 1,
      formatter: percentage
    },
    {
      metric: getDynamicMetricMatch(prefix, 'ep_bg_fetched', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelDiskReads'),
      category: [category],
      min: 0,
      formatter: number
    },
    {
      metric: getDynamicMetricMatch(prefix, 'vb_active_eject', 'Bucket'),
      label: t('in-forge:plugins.couchbaseNode.labelActiveItemsEjected'),
      category: [category],
      min: 0,
      formatter: number
    }
  ];
}
