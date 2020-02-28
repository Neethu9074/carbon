import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Req.',
    metric: 'pods.required_cpu',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Req.',
    metric: 'pods.required_mem',
    formatter: resourceQuotaBytes
  }
];
