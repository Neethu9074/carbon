import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests Count',
    metric: 'request_count',
    formatter: number.compact
  },
  {
    label: 'Index Write Count',
    metric: 'index_write_count',
    formatter: number.compact
  }
];
