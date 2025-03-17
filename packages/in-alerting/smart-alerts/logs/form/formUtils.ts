/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { getHigherOrLowerOperatorContext } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { t } from 'in-i18n';

export function getTitlePlaceholder() {
  return t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.alertPropertiesTitlePlaceholder');
}

export function getDescriptionPlaceholder(form: MapForm<any>, severity?: number) {
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  const thresholdValue = getThresholdValue(thresholdForm, severity);

  return t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.descriptionPlaceholder.logsCount', {
    context: getHigherOrLowerOperatorContext(thresholdOperator),
    value: thresholdValue
  });
}

function getThresholdValue(thresholdForm: MapForm<any>, severity?: number) {
  return severity === undefined || severity === null || severity === 5
    ? thresholdForm?.get('warningThreshold')?.get('value')?.value
    : thresholdForm?.get('criticalThreshold')?.get('value')?.value;
}
