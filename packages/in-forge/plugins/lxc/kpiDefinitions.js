import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Memory Usage',
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: 'CPU System Usage',
    metric: 'cpu.system_usage',
    formatter: percentageTwoDecimalPlaces
  }
];
