import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Sessions',
    metric: 'metrics.httpsessions.active',
    formatter: number.compact
  },
  {
    label: 'All Requests',
    metric: 'metrics.requests',
    formatter: number.compact
  }
];
