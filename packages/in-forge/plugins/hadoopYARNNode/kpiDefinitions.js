/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Running Containers',
    metric: 'runningContainers',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Available Memory',
    metric: 'availableMem',
    formatter: bytes.detailed
  }
];
