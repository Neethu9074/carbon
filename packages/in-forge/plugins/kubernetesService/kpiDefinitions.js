import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'Required CPU',
    metric: 'pods.required_cpu',
    formatter: resourceQuotaNumber
  },
  {
    label: 'Required Memory',
    metric: 'pods.required_mem',
    formatter: resourceQuotaBytes
  }
];
