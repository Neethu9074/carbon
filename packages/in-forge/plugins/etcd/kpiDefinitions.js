/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Received Requests',
    metric: 'requests_received',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Received (Bytes/Second)',
    metric: 'bytes_per_sec_received',
    formatter: bytesZeroDecimalPlaces
  }
];
