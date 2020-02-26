import { resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: 'CPU Used Requests',
    metric: 'cpuRequests',
    formatter: resourceQuotaNumber
  }
];
