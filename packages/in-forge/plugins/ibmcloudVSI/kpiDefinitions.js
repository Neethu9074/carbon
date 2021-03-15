/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Average CPU Usage Percent',
    metric: 'average_cpu_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: 'Memory Usage Percent',
    metric: 'memory_usage_percentage',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: 'Network Traffic',
    metric: 'network_in_bytes',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: 'Volume Access Size',
    metric: 'volume_read_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
