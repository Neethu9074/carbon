/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Containers',
    metric: 'container_count',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Restarts',
    metric: 'restartCount',
    formatter: zeroDecimalPlaces
  }
];
