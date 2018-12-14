import { millis, long } from 'in-services/formatters/number';

export default [
  {
    metric: 'duration',
    label: 'Duration',
    category: ['Ping'],
    min: 0,
    formatter: millis.fixedCompact
  },
  {
    metric: 'status',
    label: 'Status of Ping',
    min: 0,
    formatter: long
  }
];
