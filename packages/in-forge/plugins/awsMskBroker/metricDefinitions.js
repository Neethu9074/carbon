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
    metric: 'produce_throttle_byte_rate',
    label: 'Produce throttle byte rate',
    category: ['Throttle byte rate'],
    formatter: number.perSecond
  },
  {
    metric: 'fetch_throttle_time',
    label: 'Fetch throttle time',
    category: ['Throttle time'],
    formatter: millis
  },
  {
    metric: 'fetch_throttle_byte_rate',
    label: 'Fetch throttle byte rate',
    category: ['Throttle byte rate'],
    formatter: number.perSecond
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
    metric: 'memory_free',
    label: 'Memory free',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_used',
    label: 'Memory used',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_cached',
    label: 'Memory cached',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_buffered',
    label: 'Memory buffered',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'swap_free',
    label: 'Swap free',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'swap_used',
    label: 'Swap used',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'network_rx_packets',
    label: 'Network received packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_rx_dropped',
    label: 'Network dropped receive packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_rx_errors',
    label: 'Network receive errors',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_packets',
    label: 'Network transmitted packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_dropped',
    label: 'Network dropped transmit packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_errors',
    label: 'Network transmit errors',
    category: ['Network'],
    formatter: number
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
