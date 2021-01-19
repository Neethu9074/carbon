/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Local Connections',
    metric: 'hotRod.numberOfLocalConnections',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Global Connections',
    metric: 'hotRod.numberOfGlobalConnections',
    formatter: zeroDecimalPlaces
  }
];
