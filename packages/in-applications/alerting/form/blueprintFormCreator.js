import { blacklistedTagFiltersOfAlertType } from 'in-applications/alerting/data/blueprintConfig';
import { metricNameForAlertType } from 'in-applications/alerting/form/thresholdFormData';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType) {
  const threshold = form.get('threshold').toJS();
  const tagFilters = form.get('tagFilters').value;

  const blacklistedTagFilters = blacklistedTagFiltersOfAlertType(alertType);
  const isNotBlacklisted = filter => !blacklistedTagFilters.includes(filter.name);

  const newThresholdForm = createThresholdForm(
    {
      ...threshold,
      type: getThresholdTypeForAlertType(alertType, threshold)
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
    metricName: metricNameForAlertType[alertType]
  });

  return form
    .updateIn(['tagFilters'], f => f.setValue(tagFilters.filter(isNotBlacklisted)))
    .put('rule', newRuleForm)
    .put('threshold', newThresholdForm);
}

function getThresholdTypeForAlertType(alertType, threshold) {
  if (alertType === 'errorRate' || alertType === 'logs') {
    return 'staticThreshold';
  }
  if (alertType === 'slowness') {
    return getSlownessThresholdType(threshold);
  }
}

function getSlownessThresholdType(threshold) {
  return threshold.baseline && threshold.baseline.length > 0 ? 'historicBaseline' : 'staticThreshold';
}
