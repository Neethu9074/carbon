import {
  blacklistedTagFiltersOfAlertType,
  availableTagFiltersPerAlertType
} from 'in-websites/alerting/data/blueprintConfig';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType) {
  const threshold = form.get('threshold').toJS();
  const tagFilters = form.get('tagFilters').value;

  const blacklistedTagFilters = blacklistedTagFiltersOfAlertType(alertType);
  const isNotBlacklisted = filter => !blacklistedTagFilters.includes(filter.name);
  const availableTagFilters = availableTagFiltersPerAlertType[alertType];
  const isAvailable = availableTagFilters ? filter => availableTagFilters.includes(filter.name) : () => true;

  const blueprintConfig = getBlueprintConfig(alertType);
  const newThresholdForm = createThresholdForm(
    {
      ...threshold,
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

  return form
    .updateIn(['tagFilters'], f => f.setValue(tagFilters.filter(isNotBlacklisted).filter(isAvailable)))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);
}
