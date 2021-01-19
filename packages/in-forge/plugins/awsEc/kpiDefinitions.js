/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Utilization',
    metric: 'cpu_utilization',
    formatter: percentage.compact
  },
  {
    label: 'Freeable Memory',
    metric: 'freeable_memory',
    formatter: bytes.compact
  }
];
