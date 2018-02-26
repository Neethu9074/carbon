import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'get_records_records',
    label: 'Get Records records',
    category: ['Records'],
    formatter: number
  },
  {
    metric: 'get_records_success',
    label: 'Get Records success',
    category: ['Records'],
    formatter: number
  }
];
