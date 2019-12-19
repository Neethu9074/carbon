import { bytesTwoDecimalPlaces, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Free Memory',
    metric: 'memFree',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: 'CPU Usage',
    metric: 'cpuUsed',
    formatter: percentagePlainZeroDecimalPlaces
  }
];
