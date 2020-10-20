import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests',
    metric: 'request_count',
    formatter: number.compact
  },
  {
    label: 'Index Writes',
    metric: 'index_write_count',
    formatter: number.compact
  }
];
