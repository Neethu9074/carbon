/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Open Inputs',
    metric: 'openInputs',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Open Outputs',
    metric: 'openOutputs',
    formatters: zeroDecimalPlaces
  }
];
