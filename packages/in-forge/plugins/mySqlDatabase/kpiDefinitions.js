/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Queries',
    metric: 'status.QUERIES',
    formatter: number.compact
  },
  {
    label: 'Threads connected',
    metric: 'status.THREADS_CONNECTED',
    formatter: number.compact
  }
];
