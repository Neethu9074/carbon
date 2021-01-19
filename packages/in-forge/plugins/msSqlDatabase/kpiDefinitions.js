/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'User Connections',
    metric: 'generalstats._total.user_connections',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Page IO-Latch EX Wait-Times (ms)',
    metric: 'waitstats.PAGEIOLATCH_EX.wait_time_ms',
    formatter: msZeroDecimalPlaces
  }
];
