/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';

import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { AdaptiveBaselineConfig, ApplicationAlertRule, HistoricBaselineConfig, StaticThresholdConfig } from 'in-types';
import { ApplicationAlertType, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';

export default function createBlueprintForm(
  form: MapForm,
  alertType: ApplicationAlertType,
  alertThreshold = {},
  isSimpleMode: boolean
): MapForm {
  const threshold = (form.get('threshold') as MapForm).toJS();

  const blueprintConfig = getBlueprintConfig(alertType)!;

  const newThresholdForm: MapForm = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      // In simple mode, user does not have a choice to change threshold type, so we need to set it to HISTORIC_BASELINE
      // when user select a blueprint which has baseline enabled!
      type: blueprintConfig.baselineEnabled ? (isSimpleMode ? HISTORIC_BASELINE : threshold.type) : STATIC_THRESHOLD
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
  if (blueprintConfig?.impactTimeThresholdDisabled && timeThreshold.type === timeThresholdTypes.traceImpact) {
    return updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold, threshold.type));
  }

  return updatedForm;
}
