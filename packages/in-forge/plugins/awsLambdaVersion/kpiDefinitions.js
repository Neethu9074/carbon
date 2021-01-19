/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Invocations',
    metric: 'invocations',
    formatter: number.compact
  },
  {
    label: 'Duration Average',
    metric: 'duration',
    formatter: millis.compact
  }
];
