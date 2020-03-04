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
