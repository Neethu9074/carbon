import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'All Queues Messages Count',
    metric: 'totalMessageCount',
    formatter: number
  },
  {
    label: 'Address Memory Usage',
    metric: 'addressMemoryPercentage',
    formatter: percentage.compact
  }
];
