/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Load',
    metric: 'cpu.load',
    formatter: number.detailed
  },
  {
    label: 'Memory Used',
    metric: 'memory.used',
    formatter: bytesZeroDecimalPlaces
  }
];
