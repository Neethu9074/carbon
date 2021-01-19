/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Connections',
    metric: 'connectionCount',
    formatter: number.compact
  },
  {
    label: 'Sessions',
    metric: 'sessionCount',
    formatters: number.compact
  }
];
