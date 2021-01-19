/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'All Queues Messages Count',
    metric: 'totalMessageCount',
    formatter: number.compact
  },
  {
    label: 'Address Memory Usage',
    metric: 'addressMemoryPercentage',
    formatter: percentage.compact
  }
];
