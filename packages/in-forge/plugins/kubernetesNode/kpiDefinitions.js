/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Requests',
    metric: 'cpu.total_usage',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Requests',
    metric: 'memory.usage',
    formatter: resourceQuotaBytes
  }
];
