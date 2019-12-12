import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Exceptions Thrown',
    metric: 'metrics.exceptionThrownCount',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Contention Count',
    metric: 'metrics.contentionCount',
    formatter: zeroDecimalPlaces
  }
];
