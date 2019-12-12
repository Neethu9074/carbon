import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Alive Workers',
    metric: 'workers.aliveWorkers',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Used Memory',
    metric: 'workers.memoryInUseTotal',
    formatter: bytesZeroDecimalPlaces
  }
];
