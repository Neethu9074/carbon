/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'HTTP Requests Total',
    metric: 'http_requests_total',
    formatter: zeroDecimalPlaces
  }
];
