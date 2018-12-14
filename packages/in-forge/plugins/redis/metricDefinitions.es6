import { bytes, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metric: 'used_memory',
    label: 'Used memory',
    formatter: bytes
  },
  {
    metric: 'mem_fragmentation_ratio',
    label: 'Memory fragmentation ratio',
    formatter: percentageZeroDecimalPlaces
  }
];
