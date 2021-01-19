/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Time Spent in User Mode',
    metric: 'metrics.ru_utime',
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    label: 'Shared Memory Size',
    metric: 'metrics.ru_ixrss',
    formatter: bytesTwoDecimalPlaces
  }
];
