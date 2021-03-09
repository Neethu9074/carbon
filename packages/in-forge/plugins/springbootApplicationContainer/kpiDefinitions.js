/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Sessions',
    metric: 'metrics.httpsessions.active',
    formatter: number.compact
  },
  {
    label: 'All Requests',
    metric: 'metrics.requests',
    formatter: number.compact
  }
];
