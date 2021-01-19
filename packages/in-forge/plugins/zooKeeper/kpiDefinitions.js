/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Average Request Latency',
    metric: 'avg_request_latency',
    formatter: msZeroDecimalPlaces
  },
  {
    label: 'Outstanding Requests',
    metric: 'outstanding_requests',
    formatter: zeroDecimalPlaces
  }
];
