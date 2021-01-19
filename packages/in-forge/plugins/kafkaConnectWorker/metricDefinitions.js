/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'completedRebalancesTotal',
    label: 'Completed Rebalances',
    formatter: number
  },
  {
    metric: 'rebalanceAvgTimeMs',
    label: 'Rebalance Average Time',
    formatter: millis
  },
  {
    metric: 'rebalancing',
    label: 'Rebalancing',
    formatter: number
  },
  {
    metric: 'timeSinceLastRebalanceMs',
    label: 'Time Since Last Rebalance',
    formatter: millis
  }
];
