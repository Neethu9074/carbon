/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests/Second',
    metric: 'requests',
    formatter: number.compact
  },
  {
    label: 'Reading Connections',
    metric: 'connections.reading',
    formatters: number.compact
  }
];
