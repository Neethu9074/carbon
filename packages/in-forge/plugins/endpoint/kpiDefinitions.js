/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'Synthetic Calls per Second',
    metric: 'synthetic_count',
    formatter: number.compact
  },
  {
    label: 'Synthetic Error Rate',
    metric: 'synthetic_error_rate',
    formatter: percentage.compact
  }
];
