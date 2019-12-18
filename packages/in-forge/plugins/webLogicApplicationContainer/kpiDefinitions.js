import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Idle Threads',
    metric: 'threadPool.idleThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Error Log Messages',
    metric: 'serverLogMessages.errors',
    formatter: zeroDecimalPlaces
  }
];
