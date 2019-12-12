import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Total Sessions',
    metric: 'totalSessionCount',
    formatter: zeroDecimalPlaces
  }
];
