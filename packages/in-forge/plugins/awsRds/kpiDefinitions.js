/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage',
    metric: 'cpu_utilization',
    formatter: percentage.compact
  },
  {
    label: 'Available Storage Space',
    metric: 'free_storage_space',
    formatters: bytes.compact
  }
];
