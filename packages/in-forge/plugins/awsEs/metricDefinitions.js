/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  number,
  seconds,
  bytesPerSecondTwoDecimalPlaces,
  bytes,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';

export default [
  {
    metric: 'cluster_status_green',
    label: 'Green',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cluster_status_yellow',
    label: 'Yellow',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cluster_status_red',
    label: 'Red',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'nodes',
    label: '# of nodes in the cluster',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cpu_utilization',
    label: 'Cpu utilization',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'searchable_documents',
    label: 'Searchable documents',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'free_storage_space',
    label: 'Free storage space',
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'cluster_used_space',
    label: 'Cluster used space',
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'cluster_index_writes_blocked',
    label: 'Cluster index writes blocked',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'jvm_memory_pressure',
    label: 'Jvm memory pressure',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'automated_snapshot_failure',
    label: 'Automated snapshot failure',
    min: 0,
    formatter: number.compact
  },
  {
    metric: '2xx',
    label: '2xx',
    min: 0,
    formatter: number.compact
  },
  {
    metric: '3xx',
    label: '3xx',
    min: 0,
    formatter: number.compact
  },
  {
    metric: '4xx',
    label: '4xx',
    min: 0,
    formatter: number.compact
  },
  {
    metric: '5xx',
    label: '5xx',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'read_latency',
    label: 'Read latency',
    min: 0,
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: 'Write latency',
    min: 0,
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: 'Read throughput',
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'write_throughput',
    label: 'Write throughput',
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'read_iops',
    label: 'Read IOPS',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'write_iops',
    label: 'Write IOPS',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'search_latency',
    label: 'Search latency',
    min: 0,
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    metric: 'cpu_credit_balance',
    label: 'Cpu credit balance',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'deleted_documents',
    label: 'Deleted documents',
    min: 0,
    formatter: number.compact
  }
];
