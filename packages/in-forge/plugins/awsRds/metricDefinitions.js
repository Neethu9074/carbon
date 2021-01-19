/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'cpu_utilization',
    label: 'CPU Usage',
    category: ['CPU'],
    formatter: percentage
  },
  {
    metric: 'cpu_credit_usage',
    label: 'CPU Credit Usage',
    category: ['CPU'],
    min: 0,
    formatter: number
  },
  {
    metric: 'cpu_credit_balance',
    label: 'CPU Credit Balance',
    category: ['CPU'],
    min: 0,
    formatter: number
  },
  {
    metric: 'burst_balance',
    label: 'Burst Balance',
    category: ['Disk'],
    min: 0,
    formatter: number
  },
  {
    metric: 'db_connections',
    label: 'DB Connections',
    category: ['Network'],
    min: 0,
    formatter: number
  },
  {
    metric: 'disk_queue_depth',
    label: 'Disk queue depth',
    category: ['Disk'],
    formatter: number
  },
  {
    metric: 'freeable_memory',
    label: 'Freeable RAM',
    category: ['Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'free_storage_space',
    label: 'Available storage space',
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'replica_lag',
    label: 'Replica lag',
    category: [],
    min: 0,
    formatter: millis
  },
  {
    metric: 'swap_usage',
    label: 'Swap usage',
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'read_iops',
    label: 'Read ops',
    category: ['Disk'],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: 'write_iops',
    label: 'Write ops',
    category: ['Disk'],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: 'read_latency',
    label: 'Read latency',
    category: ['Disk'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'write_latency',
    label: 'Write latency',
    category: ['Disk'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'read_throughput',
    label: 'Read throughput',
    category: ['Disk'],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'write_throughput',
    label: 'Write throughput',
    category: ['Disk'],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'net_receive_throughput',
    label: 'Receive throughput',
    category: ['Network'],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'net_transmit_throughput',
    label: 'Transmit throughput',
    category: ['Network'],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: 'volume_bytes_used_avg',
    label: 'Volume Bytes Used',
    category: ['Network'],
    min: 0,
    formatter: bytes
  }
];
