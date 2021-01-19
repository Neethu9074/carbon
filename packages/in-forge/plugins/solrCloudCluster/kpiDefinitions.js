/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Average Requests',
    metric: 'avg_requests',
    formatter: number.compact
  },
  {
    label: 'Average Request Time',
    metric: 'avg_time_request',
    formatter: millis.detailed
  }
];
