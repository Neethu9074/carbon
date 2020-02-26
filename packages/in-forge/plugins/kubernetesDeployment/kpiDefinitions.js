import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Usage',
    metric: 'cpu.total_usage',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Memory Usage',
    metric: 'memory.usage',
    formatter: resourceQuotaBytes
  }
];
