/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, percentage, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metric: 'apps_running',
    label: 'Apps Running',
    min: 0,
    formatter: number
  },
  {
    metric: 'apps_pending',
    label: 'Apps Pending',
    min: 0,
    formatter: number
  },
  {
    metric: 'apps_failed',
    label: 'Apps Failed',
    min: 0,
    formatter: number
  },
  {
    metric: 'memory_allocated_megabytes',
    label: 'Memory Allocated',
    min: 0,
    formatter: bytes
  },
  {
    metric: 'memory_reserved_megabytes',
    label: 'Memory Reserved',
    min: 0,
    formatter: bytes
  },
  {
    metric: 'memory_available_megabytes',
    label: 'Memory Available',
    min: 0,
    formatter: bytes
  },
  {
    metric: 'container_allocated',
    label: 'Containers Allocated',
    min: 0,
    formatter: number
  },
  {
    metric: 's3_bytes_written',
    label: 'Written',
    min: 0,
    formatter: bytes
  },
  {
    metric: 's3_bytes_read',
    label: 'Read',
    min: 0,
    formatter: bytes
  },
  {
    metric: 'hdfs_utilization',
    label: 'HDFS Utilization (deprecated)',
    min: 0,
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'HDFS_utilization',
    label: 'HDFS Utilization',
    min: 0,
    formatter: percentage
  },
  {
    metric: 'total_load',
    label: 'Total Concurrent Data Transfers',
    min: 0,
    formatter: number
  },
  {
    metric: 'active_nodes',
    label: 'Active Nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'decommissioned_nodes',
    label: 'Decommissioned Nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'lost_nodes',
    label: 'Lost Nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'unhealthy_nodes',
    label: 'Unhealthy Nodes',
    min: 0,
    formatter: number
  }
];
