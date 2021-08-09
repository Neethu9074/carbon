/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ThresholdOperator, TagFilterOperator } from 'in-types';

export function toTagFilterNumberOperator(thresholdOperator: ThresholdOperator): TagFilterOperator {
  switch (thresholdOperator) {
    case '<=':
      return 'LESS_OR_EQUAL_THAN';
    case '<':
      return 'LESS_THAN';
    case '>=':
      return 'GREATER_OR_EQUAL_THAN';
    case '>':
      return 'GREATER_THAN';
    default:
      return thresholdOperator;
  }
}

export function isGreaterOperator(thresholdOperator: ThresholdOperator): boolean {
  return thresholdOperator === '>=' || thresholdOperator === '>';
}
