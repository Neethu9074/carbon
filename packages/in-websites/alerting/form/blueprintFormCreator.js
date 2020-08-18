import {
  getBlueprintConfig,
  blacklistedTagFiltersOfAlertType,
  getAvailableTagFiltersPerAlertType
} from 'in-websites/alerting/data/blueprintConfig';
import { createViolationsInSequenceForm } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType, alertThreshold = {}) {
  const threshold = form.get('threshold').toJS();
  const tagFilters = form.get('tagFilters').value;

  const blacklistedTagFilters = blacklistedTagFiltersOfAlertType(alertType);
  const isNotBlacklisted = filter => !blacklistedTagFilters.includes(filter.name);
  const availableTagFilters = getAvailableTagFiltersPerAlertType(alertType, threshold.metricName);
  const isAvailable = availableTagFilters ? filter => availableTagFilters.includes(filter.name) : () => true;

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

  const newRuleForm = createRuleForm({
    ...form
      .get('rule')
      .remove('operator')
      .remove('value')
      .toJS(),
    alertType,
    metricName: blueprintConfig.defaultMetric
  });

  let updatedForm = form
    .updateIn(['tagFilters'], f => f.setValue(tagFilters.filter(isNotBlacklisted).filter(isAvailable)))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold').toJS();
  if (blueprintConfig.impactTimeThresholdDisabled && timeThreshold.type === 'userImpactOfViolationsInSequence') {
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold));
  }

  return updatedForm;
}
