/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['gc.hs', 'gc.fb', 'gc.ub'],
    labels: ['Size', 'Free', 'Unused'],
    min: 0,
    category: ['Heap'],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['gc.bsgc'],
    labels: ['Bytes Since GC'],
    min: 0,
    category: ['GC'],
    formatter: bytesZeroDecimalPlaces
  }
];
