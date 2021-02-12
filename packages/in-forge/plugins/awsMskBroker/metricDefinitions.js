/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'bytes_in_ser_sec',
    label: 'Bytes in per second',
    category: ['Broker traffic'],
    formatter: bytes
  },
  {
    metric: 'bytes_out_per_sec',
    label: 'Bytes out per second',
    category: ['Broker traffic'],
    formatter: bytes
  },
  {
    metric: 'messages_in_per_sec',
    label: 'Messages in per second',
    category: ['Broker traffic'],
    formatter: number
  },
  {
    metric: 'partition_count',
    label: 'Partition count',
    category: ['Partition'],
    formatter: number
  },
  {
    metric: 'under_replicated_partitions',
    label: 'Under-replicated partition count',
    category: ['Partition'],
    formatter: number
  },
  {
    metric: 'leader_count',
    label: 'Leader count',
    category: ['Partition'],
    formatter: number
  },
  {
    metric: 'request_throttle_time',
    label: 'Request throttle time',
    category: ['Throttle time'],
    formatter: millis
  },
  {
    metric: 'produce_throttle_time',
    label: 'Produce throttle time',
    category: ['Throttle time'],
    formatter: millis
  },
  {
    metric: 'fetch_throttle_time',
    label: 'Fetch throttle time',
    category: ['Throttle time'],
    formatter: millis
  },
  {
    metric: 'cpu_idle',
    label: 'CPU idle',
    category: ['CPU'],
    formatter: percentage
  },
  {
    metric: 'cpu_user',
    label: 'CPU user',
    category: ['CPU'],
    formatter: percentage
  },
  {
    metric: 'cpu_system',
    label: 'CPU system',
    category: ['CPU'],
    formatter: percentage
  },
  {
    metric: 'fetch_consumer_total_time',
    label: 'Fetch consumer total time',
    category: ['Fetch time'],
    formatter: millis
  },
  {
    metric: 'fetch_follower_total_time',
    label: 'Fetch follower total time',
    category: ['Fetch time'],
    formatter: millis
  },
  {
    metric: 'produce_total_time',
    label: 'Produce total time',
    category: ['Produce time'],
    formatter: millis
  },
  {
    metric: 'request_bytes_mean',
    label: 'Request bytes',
    category: ['Request'],
    formatter: bytes
  },
  {
    metric: 'network_processor_idle',
    label: 'Network processor idle',
    category: ['Idle time'],
    formatter: percentage
  },
  {
    metric: 'request_handler_idle',
    label: 'Request handler idle ',
    category: ['Idle time'],
    formatter: percentage
  }
];
