/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

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
