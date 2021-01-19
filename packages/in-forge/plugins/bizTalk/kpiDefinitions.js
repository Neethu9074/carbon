/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Message Delivery Delay (ms)',
    metric: 'delay',
    formatter: millis.compact
  },
  {
    label: 'Active Send Threads',
    metric: 'send_threads',
    formatter: number.compact
  }
];
