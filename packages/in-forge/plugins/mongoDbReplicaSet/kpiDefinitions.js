/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Returned Documents',
    metric: 'documents.returned',
    formatter: number.compact
  },
  {
    label: 'Replication Lag',
    metric: 'repl.replication_lag',
    formatter: millis.compact
  }
];
