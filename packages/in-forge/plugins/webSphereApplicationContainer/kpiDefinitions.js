import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Threads',
    metric: 'threadPools.webContainer.activeThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Pool Size',
    metric: 'threadPools.webContainer.poolSize',
    formatter: zeroDecimalPlaces
  }
];
