/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Idle Threads',
    metric: 'idleThreads',
    formatter: number.compact
  },
  {
    label: 'Total Threads',
    metric: 'threads',
    formatter: number.compact
  }
];
