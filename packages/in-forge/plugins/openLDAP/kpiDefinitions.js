import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Operations Complete',
    metric: 'ops_completed',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Current Connections',
    metric: 'conn_current',
    formatter: zeroDecimalPlaces
  }
];
