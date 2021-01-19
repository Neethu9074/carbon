/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Gets',
    metric: 'cmd_get',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Sets',
    metric: 'cmd_set',
    formatter: zeroDecimalPlaces
  }
];
