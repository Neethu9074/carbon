/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Concurrent Invocations',
    metric: 'ibm_functions_concurrent-invocations',
    formatter: zeroDecimalPlaces
  }
];