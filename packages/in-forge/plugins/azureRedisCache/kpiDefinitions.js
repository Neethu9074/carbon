import { number, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Operations Per Second',
    metric: 'operationsPerSecond',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Evicted Keys',
    metric: 'evictedKeys',
    formatters: number.compact
  }
];
