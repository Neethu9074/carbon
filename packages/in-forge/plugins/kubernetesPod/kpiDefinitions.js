import { bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage',
    metric: 'cpu.total_usage',
    formatter: twoDecimalPlaces
  },
  {
    label: 'Memory Usage',
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  }
];
