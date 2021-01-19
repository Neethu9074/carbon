/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Total Time',
    metric: 'cpu.total_usage',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'CPU Throttling Count',
    metric: 'cpu.throttling_count',
    formatter: number.compact
  }
];
