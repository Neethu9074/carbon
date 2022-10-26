/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import { ThresholdOperator } from 'in-types';
import { t } from 'in-i18n';

export const thresholdGreaterOperatorOptions = Object.freeze([
  { value: '>=', label: humanReadableThresholdOperator('>=') },
  { value: '>', label: humanReadableThresholdOperator('>') }
]);

export const thresholdOperatorOptions = Object.freeze([
  { value: '>=', label: humanReadableThresholdOperator('>=') },
  { value: '>', label: humanReadableThresholdOperator('>') },
  { value: '<=', label: humanReadableThresholdOperator('<=') },
  { value: '<', label: humanReadableThresholdOperator('<') }
]);

export function humanReadableThresholdOperator(operator: string): string {
  if (operator === '>=') {
    return '≥';
  }
  if (operator === '<=') {
    return '≤';
  }
  return operator;
}

export const thresholdTypeOptions = Object.freeze([
  {
    value: STATIC_THRESHOLD,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')
  },
  {
    value: `${HISTORIC_BASELINE}.${DAILY}`,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionHistoricBaselineDaily')
  },
  {
    value: `${HISTORIC_BASELINE}.${WEEKLY}`,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionHistoricBaselineWeekly')
  }
]);

/**
 * We removed LT/LTE operators. To don't break older configs which have one of those operators,
 * we add it to the options object. The backend will still handle these options for API users.
 */
export function enrichThresholdOperatorOptionsForApiConfigs(operator: ThresholdOperator) {
  let legacyOperator = null;

  if (operator === '<=' || operator === '<') {
    legacyOperator = { value: operator, label: humanReadableThresholdOperator(operator) };
  }

  return Object.freeze([...thresholdGreaterOperatorOptions, legacyOperator].filter(Boolean));
}
