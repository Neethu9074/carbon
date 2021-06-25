/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';

export default function createBlueprintForm(form, alertType, alertThreshold = {}) {
  const threshold = form.get('threshold').toJS();
  const tagFilterExpression = form.get('tagFilterExpression').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const newThresholdForm = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      type: blueprintConfig.baselineEnabled ? threshold.type : STATIC_THRESHOLD,
      value: null, // reset the "old" value if present
      baseline: null // reset the "old" value if present
    },
    alertType
  );

  const metricName = blueprintConfig.defaultMetric;
  const newRuleForm = createRuleForm({
    ...form
      .get('rule')
      .remove('operator')
      .remove('value')
      .toJS(),
    alertType,
    metricName
  });

  // TODO when switching the blueprint, we currently do a cleanup based on the UI catalog. However, we should rely on
  //      the backend catalog instead. And then blueprintConfig.getAvailableTags(metricName) can be removed.
  const availableTagFilters = blueprintConfig.getAvailableTags(metricName);
  const backendModel = toBackendQueryModel(tagFilterExpression);
  const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);
  const filteredTagFilterExpression = fromBackendModel(cleanedUpExpression);

  let updatedForm = form
    .updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold').toJS();
  if (blueprintConfig.impactTimeThresholdDisabled && timeThreshold.type === 'userImpactOfViolationsInSequence') {
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold));
  }

  return updatedForm;
}
