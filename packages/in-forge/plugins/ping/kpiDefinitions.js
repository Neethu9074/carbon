import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Duration',
    metric: 'duration',
    formatter: millis.fixedCompact
  },
  {
    label: 'Status',
    metric: 'status',
    formatter: number.compact
  }
];
