/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function createBlueprintForm(form, alertType, alertThreshold = {}) {
  const threshold = form.get('threshold').toJS();

  const blueprintConfig = getBlueprintConfig(alertType);
  const newThresholdForm = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      type: blueprintConfig.baselineEnabled ? threshold.type : STATIC_THRESHOLD
    },
    alertType
  );

  const newRuleForm = createRuleForm({
    ...form
      .get('rule')
      .remove('operator')
      .remove('value')
      .remove('message')
      .remove('level')
      .toJS(),
    alertType,
    metricName: blueprintConfig.defaultMetric
  });

  let updatedForm = form.put('rule', newRuleForm).put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold').toJS();
  if (blueprintConfig.impactTimeThresholdDisabled && timeThreshold.type === 'requestImpact') {
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold));
  }

  return updatedForm;
}
