import { resourceQuotaPercentage } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Req. Alloc.',
    metric: 'required_cpu_percentage',
    formatter: resourceQuotaPercentage
  },
  {
    label: 'Memory Req. Alloc.',
    metric: 'required_mem_percentage',
    formatter: resourceQuotaPercentage
  }
];
