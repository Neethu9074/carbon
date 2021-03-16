/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { identity } from 'in-services/formatters/string';
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['http_requests_total'],
    labels: ['HTTP Requests Total'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['name'],
    labels: ['Name'],
    min: 0,
    formatter: identity
  }
];
