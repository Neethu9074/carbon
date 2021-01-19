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

export default [
  {
    metric: 'num_mons',
    label: 'Number of monitors',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_active_mons',
    label: 'Number of active monitors',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'num_osds',
    label: 'Total mumber of osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_up_osds',
    label: 'Total number of osds in state UP',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_in_osds',
    label: 'Total number of osds in state IN',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'commit_latency_ms',
    label: 'Commit latency in ms',
    min: 0,
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'apply_latency_ms',
    label: 'Apply latency in ms',
    min: 0,
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'num_near_full_osds',
    label: 'Number of near full osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_full_osds',
    label: 'Number of full osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_pgs',
    label: 'Number of pgs',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_full_osds',
    label: 'Number of active+clean pgs',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_pools',
    label: 'Number of pools',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_objects',
    label: 'Number of objects',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'aggregate_pct_used',
    label: 'Overall capacity usage',
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: 'read_bytes_sec',
    label: 'Read bytes per second',
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'write_bytes_sec',
    label: 'Write bytes per second',
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'read_op_per_sec',
    label: 'Read ops',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'write_op_per_sec',
    label: 'Write ops',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'pct_used_pool', 'Pool'),
    label: 'Overall Capacity Usage',
    category: ['Pools'],
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'num_objects_pool', 'Pool'),
    label: 'Number of objects',
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_bytes_pool', 'Pool'),
    label: 'Total bytes (Read)',
    category: ['Pools'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_bytes_pool', 'Pool'),
    label: 'Total bytes (Write)',
    category: ['Pools'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_bytes_sec_pool', 'Pool'),
    label: 'Read bytes per second',
    category: ['Pools'],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_bytes_sec_pool', 'Pool'),
    label: 'Write bytes per second',
    category: ['Pools'],
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('pools', 'read_op_per_sec', 'Pool'),
    label: 'Read ops',
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('pools', 'write_op_per_sec', 'Pool'),
    label: 'Write ops',
    category: ['Pools'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'overall_status',
    label: 'Status of the Ceph Cluster',
    min: 0,
    formatter: number.compact
  }
];
