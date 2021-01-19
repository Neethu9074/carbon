/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ms, number } from 'in-services/formatters/number';

export default [
  {
    label: 'All Calls/Second',
    metric: 'count',
    formatter: number.compact
  },
  {
    label: 'All Calls Avg. Latency',
    metric: 'duration.mean',
    formatter: ms.compact
  }
];
