import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Total Percentage',
    metric: 'cpu.total',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'Memory Usage',
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  }
];
