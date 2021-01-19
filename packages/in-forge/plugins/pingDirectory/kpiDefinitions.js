/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Operations',
    metric: 'operations_in_progress',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Established Connections',
    metric: 'established_connections',
    formatter: zeroDecimalPlaces
  }
];
