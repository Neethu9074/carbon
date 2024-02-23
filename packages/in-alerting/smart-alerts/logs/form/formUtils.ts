/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

//@ts-expect-error
import { getHigherOrLowerOperatorContext } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

export function getTitlePlaceholder() {
  return t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.alertPropertiesTitlePlaceholder');
}

export function getDescriptionPlaceholder(form: MapForm<any>) {
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  const thresholdValue = thresholdForm.get('value').value;
  return t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.descriptionPlaceholder.logsCount', {
    context: getHigherOrLowerOperatorContext(thresholdOperator),
    value: thresholdValue
  });
}
