import { createViolationsInSequenceForm } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

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

  const isNotBlacklisted = filter => !blueprintConfig.blacklistedTagFilters.includes(filter.name);
  let updatedForm = form
    .updateIn(['tagFilters'], f => f.setValue(tagFilters.filter(isNotBlacklisted)))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);

  const timeThreshold = updatedForm.get('timeThreshold').toJS();
  if (blueprintConfig.impactTimeThresholdDisabled && timeThreshold.type === 'requestImpact') {
    updatedForm = updatedForm.put('timeThreshold', createViolationsInSequenceForm(timeThreshold));
  }

  return updatedForm;
}
