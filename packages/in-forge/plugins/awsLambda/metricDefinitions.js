/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'invocations',
    label: 'Invocations',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'errors',
    label: 'Errors',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'dead_letter_error',
    label: 'Dead Letter Error',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'duration',
    label: 'Duration Average',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_maximum',
    label: 'Duration Maximum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_minimum',
    label: 'Duration Minimum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_sum',
    label: 'Duration Sum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'throttles',
    label: 'Throttles',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'iterator_age',
    label: 'Iterator Age Average',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_minimum',
    label: 'Iterator Age Minimum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_maximum',
    label: 'Iterator Age Maximum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_sum',
    label: 'Iterator Age Sum',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'concurrent_executions',
    label: 'Concurrent Executions Average',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_maximum',
    label: 'Concurrent Executions Maximum',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_minimum',
    label: 'Concurrent Executions Minimum',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_sum',
    label: 'Concurrent Executions Sum',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'unreserved_concurrent_executions',
    label: 'Unreserved Concurrent Executions',
    min: 0,
    formatter: number.compact
  }
];
