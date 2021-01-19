/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests per second',
    metric: 'api.request_count',
    formatter: number.detailed
  },
  {
    label: 'Objects Count',
    metric: 'storage.object_count',
    formatter: number.compact
  },
  {
    label: 'Objects Size',
    metric: 'storage.total_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
