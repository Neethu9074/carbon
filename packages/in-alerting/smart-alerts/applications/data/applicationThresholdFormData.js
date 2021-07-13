/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

const baselineTypes = [HISTORIC_BASELINE, ADAPTIVE_BASELINE];

export const applicationThresholdTypeOptions = adaptiveBaselineEnabled
  ? deepFreeze([
      ...thresholdTypeOptions,
      {
        value: ADAPTIVE_BASELINE,
        label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
      }
    ])
  : thresholdTypeOptions;

/**
 *
 * @param {string} thresholdType
 * @returns true if thresholdType is one of types HISTORIC_BASELINE or ADAPTIVE_BASELINE, else false
 */
export function isOneOfBaselineTypes(thresholdType) {
  return baselineTypes.includes(thresholdType);
}

/**
 *
 * @param {[{value: string, label: string}]} thresholdTypeOptions
 * @param {string} evaluationType
 * @returns list containing only thresholdTypeOptions which are available for a given evaluationType.
 */
export function getAvailableOptionsForEvaluationType(thresholdTypeOptions = [], evaluationType, isGlobalSmartAlert) {
  return thresholdTypeOptions.filter(({ value }) => {
    if (isGlobalSmartAlert || [PER_AP_SERVICE, PER_AP_ENDPOINT].includes(evaluationType)) {
      return [ADAPTIVE_BASELINE, STATIC_THRESHOLD].includes(value.split('.')[0]);
    }
    return true;
  });
}

/**
 * @param {[{value: string, label: string}]} thresholdTypeOptions
 */
export function withoutHistoricBaselineOptions(thresholdTypeOptions = []) {
  return thresholdTypeOptions.filter(({ value }) =>
    [ADAPTIVE_BASELINE, STATIC_THRESHOLD].includes(value.split('.')[0])
  );
}
