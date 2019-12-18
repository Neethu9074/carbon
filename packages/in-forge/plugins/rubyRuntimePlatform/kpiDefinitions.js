import { kiloBytesZeroDecimalPlaces, msTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'RSS',
    metric: 'memory.rss_size',
    formatter: kiloBytesZeroDecimalPlaces
  },
  {
    label: 'Time Spent in GC',
    metric: 'gc.totalTime',
    formatter: msTwoDecimalPlaces
  }
];
