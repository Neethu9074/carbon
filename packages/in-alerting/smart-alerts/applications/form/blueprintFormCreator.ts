/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';

import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { AdaptiveBaselineConfig, ApplicationAlertRule, HistoricBaselineConfig, StaticThresholdConfig } from 'in-types';
import { ApplicationAlertType, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function createBlueprintForm(
  form: MapForm,
  alertType: ApplicationAlertType,
  alertThreshold = {}
): MapForm {
  const threshold = (form.get('threshold') as MapForm).toJS();

  const blueprintConfig = getBlueprintConfig(alertType)!;

  const newThresholdForm: MapForm = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      type: blueprintConfig.baselineEnabled ? threshold.type : STATIC_THRESHOLD
    } as HistoricBaselineConfig | StaticThresholdConfig | AdaptiveBaselineConfig,
    // while the alertType and the Type of thresholdConfig are not combined in a parent Alert Config, this is
    // currently a too complicated typing, and will need further refactoring and improving!,
    alertType
  );

  const metricName = blueprintConfig.defaultMetric;
  const newRuleForm = createRuleForm({
    ...((form.get('rule') as MapForm)
      .remove('operator')
      .remove('value')
      .remove('message')
      .remove('level')
      .toJS() as ApplicationAlertRule),
    alertType,
    metricName
  });

  const updatedForm = form.put('rule', newRuleForm).put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold')!.toJS();
  if (blueprintConfig?.impactTimeThresholdDisabled && timeThreshold.type === timeThresholdTypes.requestImpact) {
    return updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold, threshold.type));
  }

  return updatedForm;
}
