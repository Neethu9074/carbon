import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Heap (Size)',
    metric: 'gc.hs',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: 'Bytes Since GC',
    metric: 'gc.bsgc',
    formatter: bytesZeroDecimalPlaces
  }
];
