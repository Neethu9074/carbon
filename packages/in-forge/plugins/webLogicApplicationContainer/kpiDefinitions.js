/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Idle Threads',
    metric: 'threadPool.idleThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Error Log Messages',
    metric: 'serverLogMessages.errors',
    formatter: zeroDecimalPlaces
  }
];
