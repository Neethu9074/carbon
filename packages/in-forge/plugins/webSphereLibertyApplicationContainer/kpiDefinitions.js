/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Threads',
    metric: 'threadPool.activeThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Pool Size',
    metric: 'threadPool.poolSize',
    formatter: zeroDecimalPlaces
  }
];
