/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createViolationsInSequenceForm } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType, alertThreshold = {}) {
  const threshold = form.get('threshold').toJS();
  const tagFilters = form.get('tagFilters').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const newThresholdForm = createThresholdForm(
    {
      ...threshold,
      ...alertThreshold,
      type: blueprintConfig.baselineEnabled ? threshold.type : 'staticThreshold',
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

  const availableTagFilters = blueprintConfig.getAvailableTags(metricName);
  const isAllowedFilter = filter => availableTagFilters.includes(filter.name);
  let updatedForm = form
    // TODO when QB2 is introduced for Website SmartAlerts, we need to properly cleanup unsupported filters from the
    //      query, by recursively traversing the query. This is needed for Website SmartAlerts, but not for
    //      AP SmartAlerts because the website area has a different catalog for each beacon type.
    .updateIn(['tagFilters'], f => f.setValue(tagFilters.filter(isAllowedFilter)))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold').toJS();
  if (blueprintConfig.impactTimeThresholdDisabled && timeThreshold.type === 'userImpactOfViolationsInSequence') {
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold));
  }

  return updatedForm;
}
