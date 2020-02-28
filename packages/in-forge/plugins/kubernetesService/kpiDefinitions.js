import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
export default [
  {
    label: 'CPU Req.',
    metric: 'cpuRequests',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Req.',
    metric: 'memoryRequests',
    formatter: resourceQuotaBytes
  }
];
