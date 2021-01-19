/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Total Usage',
    metric: 'cpu.total_usage',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'Memory Usage',
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  }
];
