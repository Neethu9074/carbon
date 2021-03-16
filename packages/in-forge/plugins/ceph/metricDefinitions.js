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
    metric: 'num_mons',
    label: t('in-forge:plugins.ceph.labelNumberOfMonitors'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_active_mons',
    label: t('in-forge:plugins.ceph.labelNumberOfActiveMonitors'),
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'num_osds',
    label: t('in-forge:plugins.ceph.labelTotalOsds'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_up_osds',
    label: t('in-forge:plugins.ceph.labelTotalOsdsUP'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_in_osds',
    label: t('in-forge:plugins.ceph.labelTotalOsdsIN'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'commit_latency_ms',
    label: t('in-forge:plugins.ceph.labelCommitLatency'),
    min: 0,
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'apply_latency_ms',
    label: t('in-forge:plugins.ceph.labelApplyLatency'),
    min: 0,
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'num_near_full_osds',
    label: t('in-forge:plugins.ceph.labelNumberNearFullOsds'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_full_osds',
    label: t('in-forge:plugins.ceph.labelNumberOsds'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_pgs',
    label: t('in-forge:plugins.ceph.labelNumberPgs'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_full_osds',
    label: t('in-forge:plugins.ceph.labelNumberActivePgs'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_pools',
    label: t('in-forge:plugins.ceph.labelNumberPools'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_objects',
    label: t('in-forge:plugins.ceph.labelNumberObjects'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'aggregate_pct_used',
    label: t('in-forge:plugins.ceph.labelOverallCapacityUsage'),
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: 'read_bytes_sec',
    label: t('in-forge:plugins.ceph.labelReadBPS'),
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'write_bytes_sec',
    label: t('in-forge:plugins.ceph.labelWriteBPS'),
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'read_op_per_sec',
    label: t('in-forge:plugins.ceph.labelReadOps'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'write_op_per_sec',
    label: t('in-forge:plugins.ceph.labelWriteOps'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'pct_used_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelOverallCapacityUsage'),
    category: ['Pools'],
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'num_objects_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelNumberObjects'),
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_bytes_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelTotalRead'),
    category: ['Pools'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_bytes_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelTotalWrite'),
    category: ['Pools'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_bytes_sec_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelReadBPS'),
    category: ['Pools'],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_bytes_sec_pool', 'Pool'),
    label: t('in-forge:plugins.ceph.labelWriteBPS'),
    category: ['Pools'],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_op_per_sec', 'Pool'),
    label: t('in-forge:plugins.ceph.labelReadOps'),
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_op_per_sec', 'Pool'),
    label: t('in-forge:plugins.ceph.labelWriteOps'),
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'overall_status',
    label: t('in-forge:plugins.ceph.labelStatus'),
    min: 0,
    formatter: number.compact
  }
];
