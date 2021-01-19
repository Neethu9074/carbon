/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const thresholdGreaterOperatorOptions = Object.freeze([
  { value: '>=', label: '≥' },
  { value: '>', label: '>' }
]);

export const thresholdOperatorOptions = Object.freeze([
  { value: '>=', label: '≥' },
  { value: '>', label: '>' },
  { value: '<=', label: '≤' },
  { value: '<', label: '<' }
]);

export const thresholdTypeOptions = Object.freeze([
  { value: 'staticThreshold', label: 'Static Threshold' },
  { value: 'historicBaseline.DAILY', label: 'Baseline (Daily Seasonality)' },
  { value: 'historicBaseline.WEEKLY', label: 'Baseline (Weekly Seasonality)' }
]);

/**
 * We removed LT/LTE operators. To don't break older configs which have one of those operators,
 * we add it to the options object. The backend will still handle these options for API users.
 */
export function enrichThresholdOperatorOptionsForApiConfigs(operator) {
  let legacyOperator = null;

  if (operator === '<=') {
    legacyOperator = { value: '<=', label: '≤' };
  }

  if (operator === '<') {
    legacyOperator = { value: '<', label: '<' };
  }

  return Object.freeze([...thresholdGreaterOperatorOptions, legacyOperator].filter(Boolean));
}
