/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRateZeroDecimalPlaces, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Throughput',
    metric: 'throughput',
    formatter: number.compact
  },
  {
    label: 'Cache Hit Rate',
    metric: 'hit_rate',
    formatter: hitRateZeroDecimalPlaces
  }
];
