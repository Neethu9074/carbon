/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';

import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { ApplicationAlertType, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { ApplicationAlertRule } from 'in-types';

type AlertThreshold = {
  operator?: string;
};

export default function createBlueprintForm(
  form: MapForm<any>,
  alertType: ApplicationAlertType,
  alertThreshold: AlertThreshold = {},
  isSimpleMode: boolean,
  editMode?: boolean
): MapForm<any> {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const defaultOperator = alertThreshold?.operator || form.get('threshold').get('operator').value;
  const blueprintConfig = getBlueprintConfig(alertType)!;
  let ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: defaultOperator,
    thresholds: {
      WARNING: {
        value:
          warningThresholdField?.get('value')?.value ??
          (warningThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null),
        type: blueprintConfig.baselineEnabled
          ? isSimpleMode
            ? HISTORIC_BASELINE
            : warningThresholdField?.get('type')?.value
          : STATIC_THRESHOLD,
        deviationFactor: warningThresholdField?.get('deviationFactor')?.value ?? defaultDeviationFactor,
        seasonality: warningThresholdField?.get('seasonality')?.value ?? null,
        baseline: warningThresholdField?.get('baseline')?.value ?? null,
        isCheckboxSelected: warningThresholdField.get('isCheckboxSelected')?.value
      },
      CRITICAL: {
        value:
          criticalThresholdField?.get('value')?.value ??
          (criticalThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null),
        type: blueprintConfig.baselineEnabled
          ? isSimpleMode
            ? HISTORIC_BASELINE
            : criticalThresholdField?.get('type')?.value
          : STATIC_THRESHOLD,
        deviationFactor: criticalThresholdField?.get('deviationFactor')?.value ?? defaultDeviationFactor,
        seasonality: criticalThresholdField?.get('seasonality')?.value ?? null,
        baseline: criticalThresholdField?.get('baseline')?.value ?? null,
        isCheckboxSelected: criticalThresholdField.get('isCheckboxSelected')?.value
      }
    }
  };
  const newThresholdForm: MapForm<any> = createThresholdForm(ruleWithThreshold, alertType, editMode);

  const metricName = blueprintConfig.defaultMetric;
  const newRuleForm = createRuleForm({
    ...((form.get('rule') as MapForm<any>)
      .remove('operator')
      .remove('value')
      .remove('message')
      .remove('level')
      .toJS() as unknown as ApplicationAlertRule),
    alertType,
    metricName
  });

  const updatedForm = form.put('rule', newRuleForm).put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold')!.toJS();
  if (blueprintConfig?.impactTimeThresholdDisabled && timeThreshold.type === timeThresholdTypes.traceImpact) {
    return updatedForm.put(
      'timeThreshold',
      createViolationsInSequenceForm(timeThreshold, form.get('threshold').get('warningThreshold').get('type').value)
    );
  }

  return updatedForm;
}
