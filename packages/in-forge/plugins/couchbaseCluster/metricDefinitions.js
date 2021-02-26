/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getBucketMetricDefinitions } from 'in-forge/plugins/couchbaseNode/metricDefinitions.js';
import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseCluster/constants.js';
import { bytes, number } from 'in-services/formatters/number';

const clusterMetricDefinitions = [
  {
    metrics: ['cluster.usedDisk'],
    labels: [t('in-forge:plugins.couchbaseCluster.labelUsedDisk')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['cluster.usedMemory'],
    labels: [t('in-forge:plugins.couchbaseCluster.labelUsedMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['cluster.ops', 'cluster.cmd_get', 'cluster.cmd_set', 'cluster.curr_items'],
    labels: [
      t('in-forge:plugins.couchbaseCluster.labelOperationsPerSec'),
      t('in-forge:plugins.couchbaseCluster.labelGetsPerSec'),
      t('in-forge:plugins.couchbaseCluster.labelSetsPerSec'),
      t('in-forge:plugins.couchbaseCluster.labelItems')
    ],
    min: 0,
    formatter: number
  }
];

const bucketMetricDefinitions = getBucketMetricDefinitions(BUCKET_METRICS_PREFIX);

export default clusterMetricDefinitions.concat(bucketMetricDefinitions);
