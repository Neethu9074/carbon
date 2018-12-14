import {
  number,
  bytes,
  msZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metric: getMetricMatch('pools', 'pct_used_pool'),
    label: 'Overall Capacity Usage',
    min: 0,
    formatter: percentageTwoDecimalPlaces
  },
  {
    metric: getMetricMatch('pools', 'num_objects_pool'),
    label: 'Number of objects',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'read_bytes_pool'),
    label: 'Total bytes (Read)',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('pools', 'write_bytes_pool'),
    label: 'Total bytes (Write)',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('pools', 'read_bytes_sec_pool'),
    label: 'Read bytes per second',
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getMetricMatch('pools', 'write_bytes_sec_pool'),
    label: 'Write bytes per second',
    min: 0,
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getMetricMatch('pools', 'read_op_per_sec'),
    label: 'Read ops',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'write_op_per_sec'),
    label: 'Write ops',
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
