/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { muSecondsToMillisZeroDecimalPlaces, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Client Read Requests',
    metric: 'clientrequests.read.count',
    formatter: number.compact
  },
  {
    label: 'Mean Read Requests',
    metric: 'clientrequests.read.mean',
    formatter: muSecondsToMillisZeroDecimalPlaces
  }
];
