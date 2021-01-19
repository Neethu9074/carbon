/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
export default [
  {
    label: 'CPU Requests',
    metric: 'cpuRequests',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Requests',
    metric: 'memoryRequests',
    formatter: resourceQuotaBytes
  }
];
