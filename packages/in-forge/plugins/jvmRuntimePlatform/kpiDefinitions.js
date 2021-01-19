/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, twoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Memory Used',
    metric: 'memory.used',
    formatter: bytes.detailed
  },
  {
    label: 'Blocked Threads',
    metric: 'threads.blocked',
    formatter: twoDecimalPlaces
  }
];
