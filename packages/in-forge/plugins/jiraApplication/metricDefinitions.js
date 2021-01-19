/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['instruments.http.sessions', 'instruments.concurrent.requests'],
    labels: ['Current Sessions', 'Concurrent Requests'],
    min: 0,
    category: ['Traffic'],
    formatter: number
  },
  {
    metric: 'instruments.dbcp.numIdle',
    label: 'Idle Connections',
    min: 0,
    formatter: number
  }
];
