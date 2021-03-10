/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Total Object Count',
    metric: 'object_count_total',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Total Used Bytes',
    metric: 'used_bytes_total',
    formatter: zeroDecimalPlaces
  }
];