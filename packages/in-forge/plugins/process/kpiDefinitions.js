/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage (User)',
    metric: 'cpu.user',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'Virtual Memory',
    metric: 'mem.virtual',
    formatter: bytesTwoDecimalPlaces
  }
];
