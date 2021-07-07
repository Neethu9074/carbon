/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { t } from 'in-i18n';

export function getOperatorLabel(form) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = (findEntryByValue(options, operatorValue) ?? options[0]).label;

  return operatorLabel;
}

export function getConfiguredThreshold(form, isGlobalSmartAlert) {
  return form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert
    ? findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label
    : t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold');
}

export function getAggregationLabel(form) {
  const aggregationOptions = getAggregationOptions(form);
  const aggregationValue = form.get('rule').get('aggregation').value;
  const option = aggregationOptions.find(o => o.value === aggregationValue);

  return option?.label;
}
