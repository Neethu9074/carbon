/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, seconds, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['read_bytes', 'write_bytes'],
    labels: ['Read bytes', 'Write bytes'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['read_ops', 'write_ops', 'queue_length'],
    labels: ['Read operations', 'Write operations', 'Queue length'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['total_read_time', 'total_write_time', 'idle_time'],
    labels: ['Total read time', 'Total write time', 'Idle time'],
    min: 0,
    formatter: seconds
  },
  {
    metrics: ['burst_balance'],
    labels: ['Burst balance'],
    min: 0,
    formatter: percentage
  }
];
