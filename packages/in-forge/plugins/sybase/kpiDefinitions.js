/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'User Connections',
    metric: 'stats.connCount',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Disk Reads',
    metric: 'stats.diskRead',
    formatter: zeroDecimalPlaces
  }
];
