import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Requests',
    metric: 'pods.required_cpu',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Requests',
    metric: 'pods.required_mem',
    formatter: resourceQuotaBytes
  }
];
