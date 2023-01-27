/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { PER_AP } from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { t } from 'in-i18n';

export function getOperatorLabel(form) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  return (findEntryByValue(options, operatorValue) ?? options[0]).label;
}

export function getConfiguredThreshold(form, isGlobalSmartAlert) {
  return form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert
    ? findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label
    : t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold');
}

export function getAggregationLabel(form) {
  const option = getAggregationOption(form);
  return option?.label;
}

export function getAggregationValue(form) {
  const option = getAggregationOption(form);
  return option?.value;
}

function getAggregationOption(form) {
  const aggregationOptions = getAggregationOptions(form);
  const aggregationValue = form.get('rule').get('aggregation').value;
  return aggregationOptions.find(o => o.value === aggregationValue);
}
