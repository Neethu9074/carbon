/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Current Sessions',
    metric: 'instruments.http.sessions',
    formatter: number.compact
  },
  {
    label: 'Idle Connections',
    metric: 'instruments.dbcp.numIdle',
    formatters: number.compact
  }
];
