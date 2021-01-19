/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage',
    metric: 'stats.cpuUsage',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: 'Used Memory',
    metric: 'stats.usedMemory',
    formatter: bytesTwoDecimalPlaces
  }
];
