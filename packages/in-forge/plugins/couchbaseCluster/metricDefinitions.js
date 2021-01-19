/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

import { getBucketMetricDefinitions } from 'in-forge/plugins/couchbaseNode/metricDefinitions.js';
import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseCluster/constants.js';

const clusterMetricDefinitions = [
  {
    metrics: ['cluster.usedDisk'],
    labels: ['Used disk (bytes)'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['cluster.usedMemory'],
    labels: ['Used memory (bytes)'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['cluster.ops', 'cluster.cmd_get', 'cluster.cmd_set', 'cluster.curr_items'],
    labels: ['Operations per sec.', 'Gets per sec.', 'Sets per sec.', 'Items'],
    min: 0,
    formatter: number
  }
];

const bucketMetricDefinitions = getBucketMetricDefinitions(BUCKET_METRICS_PREFIX);

export default clusterMetricDefinitions.concat(bucketMetricDefinitions);
