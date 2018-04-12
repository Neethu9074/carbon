import { number, bytes, kiloBytes } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: 'total_space',
    label: 'Total Space',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'total_used',
    label: 'Total Space',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'total_objects',
    label: 'Total Objects',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_down_osds',
    label: 'Unhealthy Osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_up_osds',
    label: 'Up Osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_in_osds',
    label: 'In Osds',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_osds',
    label: 'Total Osds',
    min: 0,
    formatter: bytes.compact
  },

  {
    metric: 'num_pools',
    label: 'Number of pools',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'num_pgs',
    label: 'Number of placement groups',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('mons', 'kb_total'),
    label: 'Total',
    min: 0,
    formatter: kiloBytes.compact
  },
  {
    metric: getMetricMatch('mons', 'kb_used'),
    label: 'Used',
    min: 0,
    formatter: kiloBytes.compact
  },
  {
    metric: getMetricMatch('mons', 'bytes_total'),
    label: 'Total',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('mons', 'bytes_sst'),
    label: 'Sst',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('mons', 'bytes_log'),
    label: 'Log',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('mons', 'bytes_misc'),
    label: 'Misc',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('pools', 'size_bytes'),
    label: 'Size',
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: getMetricMatch('pools', 'num_objects'),
    label: 'Total',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'num_object_clones'),
    label: 'Clones',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'num_object_copies'),
    label: 'Copies',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'read_ops'),
    label: 'Read OPS',
    min: 0,
    formatter: number.compact
  },
  {
    metric: getMetricMatch('pools', 'write_ops'),
    label: 'Write OPS',
    min: 0,
    formatter: number.compact
  }
];
