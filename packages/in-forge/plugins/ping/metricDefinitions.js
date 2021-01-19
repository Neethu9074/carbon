/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'duration',
    label: 'Duration',
    category: ['Ping'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'status',
    label: 'Status of Ping',
    min: 0,
    formatter: number
  }
];
