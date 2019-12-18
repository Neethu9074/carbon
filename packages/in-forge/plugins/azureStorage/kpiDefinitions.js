import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Total Transactions',
    metric: 'tr_to',
    formatter: number.detailed
  },
  {
    label: 'Average Ingress',
    metric: 'in_av',
    formatter: bytes.compact
  }
];
