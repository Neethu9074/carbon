/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { identity } from 'in-services/formatters/string';

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
