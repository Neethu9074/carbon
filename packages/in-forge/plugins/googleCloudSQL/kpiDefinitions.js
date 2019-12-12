import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage',
    metric: 'cpu.used',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: 'Memory Usage',
    metric: 'memory.used',
    formatter: percentageTwoDecimalPlaces
  }
];
