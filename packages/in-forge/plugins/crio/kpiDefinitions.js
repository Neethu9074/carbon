import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Total Usage',
    metric: 'cpu.total_usage',
    formatter: percentage.compact
  },
  {
    label: 'CPU Throttling Count',
    metric: 'cpu.throttling_count',
    formatter: number.compact
  }
];
