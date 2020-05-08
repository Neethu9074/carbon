import { number } from 'in-services/formatters/number';

export default [
  {
    key: 'callsAgg',
    label: 'Calls',
    formatter: number.compact
  },
  {
    key: 'erroneousCalls',
    label: 'Erroneous Calls',
    formatter: number.compact
  }
];
