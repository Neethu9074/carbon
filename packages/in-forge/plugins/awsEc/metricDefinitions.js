/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'cpu_utilization',
    label: 'CPU Utilization',
    category: ['CPU'],
    formatter: percentage
  },
  {
    metric: 'freeable_memory',
    label: 'Freeable memory',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'net_bytes_in',
    label: 'Bytes In',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'net_bytes_out',
    label: 'Bytes Out',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'swap_usage',
    label: 'Swap usage',
    category: ['Disk'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'curr_connections',
    label: 'Current connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'new_connections',
    label: 'New connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'curr_items',
    label: 'Current Items',
    category: [],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'evictions',
    label: 'Evictions',
    category: [],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'reclaimed',
    label: 'Reclaimed',
    category: [],
    min: 0,
    formatter: number.compact
  }
];
