/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { muSecondsToMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Overall Read Requests',
    metric: 'clientrequests.read.count',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Client Read Requests (99th)',
    metric: 'clientrequests.read.99',
    formatter: muSecondsToMillisTwoDecimalPlaces
  }
];
