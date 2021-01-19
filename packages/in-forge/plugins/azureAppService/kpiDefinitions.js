/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Average Response-Time',
    metric: 'art',
    formatter: millis.detailed
  },
  {
    label: 'HTTP 2xx Responses',
    metric: 'h2x',
    formatter: number.detailed
  }
];
