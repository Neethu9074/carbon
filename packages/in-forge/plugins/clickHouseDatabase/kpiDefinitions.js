/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Query Thread',
    metric: 'QueryThread',
    formatter: number.compact
  },
  {
    label: 'Query Preempted',
    metric: 'QueryPreempted',
    formatter: number.compact
  }
];
