/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: ['invocations', 'errors', 'dead_letter_error'],
    labels: ['Invocations', 'Errors', 'Dead Letter Error'],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['duration', 'duration_maximum', 'duration_minimum', 'duration_sum'],
    labels: ['Duration Average', 'Duration Maximum', 'Duration Minimum', 'Duration Sum'],
    min: 0,
    formatter: millis.compact
  },
  {
    metrics: [
      'throttles',
      'concurrent_executions',
      'concurrent_executions_maximum',
      'concurrent_executions_minimum',
      'concurrent_executions_sum',
      'unreserved_concurrent_executions'
    ],
    labels: [
      'Throttles',
      'Concurrent Executions Average',
      'Concurrent Executions Maximum',
      'Concurrent Executions Minimum',
      'Concurrent Executions Sum',
      'Unreserved Concurrent Executions'
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['iterator_age', 'iterator_age_minimum', 'iterator_age_maximum', 'iterator_age_sum'],
    labels: ['Iterator Age Average', 'Iterator Age Minimum', 'Iterator Age Maximum', 'Iterator Age Sum'],
    min: 0,
    formatter: millis.compact
  }
];
