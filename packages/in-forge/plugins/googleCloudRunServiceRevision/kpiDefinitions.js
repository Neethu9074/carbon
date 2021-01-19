/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Request Count',
    metric: 'request_count',
    formatter: number.compact
  },
  {
    label: 'Request Latency (P99)',
    metric: 'request_latencies_p99',
    formatter: millis.compact
  }
];
