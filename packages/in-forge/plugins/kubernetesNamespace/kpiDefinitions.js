import { resourceQuotaPercentage } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Requests Allocation',
    metric: 'required_cpu_percentage',
    formatter: resourceQuotaPercentage
  },
  {
    label: 'Memory Requests Allocation',
    metric: 'required_mem_percentage',
    formatter: resourceQuotaPercentage
  }
];
