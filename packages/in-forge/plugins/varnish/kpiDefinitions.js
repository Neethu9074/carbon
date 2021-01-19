/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRateZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Received Client Requests',
    metric: 'client_req',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Cache Hit Rate',
    metric: 'cache_hit_rate',
    formatter: hitRateZeroDecimalPlaces
  }
];
