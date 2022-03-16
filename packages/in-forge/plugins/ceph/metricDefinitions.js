/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  number,
  bytes,
  msZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'num_mons',
      'num_active_mons',
      'num_osds',
      'num_up_osds',
      'num_in_osds',
      'num_near_full_osds',
      'num_full_osds',
      'num_pgs',
      'num_full_osds',
      'num_pools',
      'num_objects',
      'read_op_per_sec',
      'write_op_per_sec'
    ],
    labels: [
      t('in-forge:plugins.ceph.labelNumberOfMonitors'),
      t('in-forge:plugins.ceph.labelNumberOfActiveMonitors'),
      t('in-forge:plugins.ceph.labelTotalOsds'),
      t('in-forge:plugins.ceph.labelTotalOsdsUP'),
      t('in-forge:plugins.ceph.labelTotalOsdsIN'),
      t('in-forge:plugins.ceph.labelNumberNearFullOsds'),
      t('in-forge:plugins.ceph.labelNumberOsds'),
      t('in-forge:plugins.ceph.labelNumberPgs'),
      t('in-forge:plugins.ceph.labelNumberActivePgs'),
      t('in-forge:plugins.ceph.labelNumberPools'),
      t('in-forge:plugins.ceph.labelNumberObjects'),
      t('in-forge:plugins.ceph.labelReadOps'),
      t('in-forge:plugins.ceph.labelWriteOps')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['commit_latency_ms', 'apply_latency_ms'],
    labels: [t('in-forge:plugins.ceph.labelCommitLatency'), t('in-forge:plugins.ceph.labelApplyLatency')],
    min: 0,
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'aggregate_pct_used',
    label: t('in-forge:plugins.ceph.labelOverallCapacityUsage'),
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metrics: ['read_bytes_sec', 'write_bytes_sec'],
    labels: [t('in-forge:plugins.ceph.labelReadBPS'), t('in-forge:plugins.ceph.labelWriteBPS')],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },

  {
    metric: getDynamicMetricMatch('pools', 'pct_used_pool', t('in-forge:plugins.ceph.pool')),
    label: t('in-forge:plugins.ceph.labelOverallCapacityUsage'),
    category: [t('in-forge:plugins.ceph.pools')],
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch('pools', 'num_objects_pool', t('in-forge:plugins.ceph.pool')),
      getDynamicMetricMatch('pools', 'read_op_per_sec', t('in-forge:plugins.ceph.pool')),
      getDynamicMetricMatch('pools', 'write_op_per_sec', t('in-forge:plugins.ceph.pool')),
      'overall_status'
    ],
    labels: [
      t('in-forge:plugins.ceph.labelNumberObjects'),
      t('in-forge:plugins.ceph.labelReadOps'),
      t('in-forge:plugins.ceph.labelWriteOps'),
      t('in-forge:plugins.ceph.labelStatus')
    ],
    category: [t('in-forge:plugins.ceph.pools')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('pools', 'read_bytes_pool', t('in-forge:plugins.ceph.pool')),
      getDynamicMetricMatch('pools', 'write_bytes_pool', t('in-forge:plugins.ceph.pool'))
    ],
    labels: [t('in-forge:plugins.ceph.labelTotalRead'), t('in-forge:plugins.ceph.labelTotalWrite')],
    category: [t('in-forge:plugins.ceph.pools')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('pools', 'read_bytes_sec_pool', t('in-forge:plugins.ceph.pool')),
      getDynamicMetricMatch('pools', 'write_bytes_sec_pool', t('in-forge:plugins.ceph.pool'))
    ],
    labels: [t('in-forge:plugins.ceph.labelReadBPS'), t('in-forge:plugins.ceph.labelWriteBPS')],
    category: [t('in-forge:plugins.ceph.pools')],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  }
];
