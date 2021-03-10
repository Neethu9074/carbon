/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Connections',
    metric: 'active_connection',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Throughput',
    metric: 'throughput',
    formatter: zeroDecimalPlaces
  }
];