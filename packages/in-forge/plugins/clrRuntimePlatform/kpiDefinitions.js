import { bytesZeroDecimalPlaces, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'All Heaps',
    metric: 'mem.all_heaps',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: '% Time in GC',
    metric: 'mem.time_in_gcn',
    formatter: percentage.compact
  }
];
