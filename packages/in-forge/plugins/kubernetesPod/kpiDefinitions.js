import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Restarts',
    metric: 'restartCount',
    formatter: zeroDecimalPlaces
  }
];
