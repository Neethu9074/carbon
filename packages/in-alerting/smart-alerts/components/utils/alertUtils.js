/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function toTagFilterNumberOperator(thresholdOperator) {
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

export function isGreaterOperator(thresholdOperator) {
  return thresholdOperator === '>=' || thresholdOperator === '>';
}
