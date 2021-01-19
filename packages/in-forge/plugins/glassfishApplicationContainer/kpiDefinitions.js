/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests',
    metric: 'http_request_count',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Errors',
    metric: 'http_error',
    formatter: zeroDecimalPlaces
  }
];
