import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'completedRebalancesTotal',
    label: 'Completed Rebalances',
    formatter: number
  },
  {
    metric: 'rebalanceAvgTimeMs',
    label: 'Rebalance Average Time',
    formatter: number
  },
  {
    metric: 'rebalancing',
    label: 'Rebalancing',
    formatter: number
  },
  {
    metric: 'timeSinceLastRebalanceMs',
    label: 'Time Since Last Rebalance',
    formatter: number.perSecond
  }
];
