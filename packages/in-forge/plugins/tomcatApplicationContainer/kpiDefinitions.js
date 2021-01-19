/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Total Sessions',
    metric: 'totalSessionCount',
    formatter: zeroDecimalPlaces
  }
];
