/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Used',
    metric: 'cpu.used',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'Memory Used',
    metric: 'memory.used',
    formatter: percentageZeroDecimalPlaces
  }
];
