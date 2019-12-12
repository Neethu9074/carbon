import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'Total Requests',
    metric: 'metrics.instance.tr',
    formatter: number.compact
  },
  {
    label: 'Service Availability',
    metric: 'metrics.instance.sa',
    formatter: percentage.compact
  }
];
