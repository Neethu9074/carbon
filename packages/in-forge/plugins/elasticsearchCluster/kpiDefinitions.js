/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { msZeroDecimalPlaces, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Latency',
    metric: 'query_latency',
    formatter: msZeroDecimalPlaces
  },
  {
    label: 'Indices',
    metric: 'indices_count',
    formatter: withSiPrefixZeroDecimalPlaces
  }
];
