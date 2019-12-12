import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Queries',
    metric: 'status.QUERIES',
    formatter: number.compact
  },
  {
    label: 'Client Connections',
    metric: 'status.THREADS_CONNECTED',
    formatter: number.compact
  }
];
