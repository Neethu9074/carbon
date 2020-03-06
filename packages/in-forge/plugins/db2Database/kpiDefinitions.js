import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Connections',
    metric: 'connections',
    formatter: number.compact
  },
  {
    label: 'Queues',
    metric: 'queues',
    formatter: number.compact
  }
];
