/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ThresholdOperator } from 'in-types';

export const thresholdOperatorOptions = Object.freeze([
  { value: '>=', label: humanReadableThresholdOperator('>=') },
  { value: '>', label: humanReadableThresholdOperator('>') },
  { value: '<=', label: humanReadableThresholdOperator('<=') },
  { value: '<', label: humanReadableThresholdOperator('<') }
]);

export function humanReadableThresholdOperator(operator: ThresholdOperator): string {
  if (operator === '>=') {
    return '≥';
  }
  if (operator === '<=') {
    return '≤';
  }
  return operator;
}
