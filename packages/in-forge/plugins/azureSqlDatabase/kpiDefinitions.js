import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Total DTU Limit',
    metric: 'total_dtu_limit',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Total DTU Used',
    metric: 'total_dtu_used',
    formatter: zeroDecimalPlaces
  }
];
