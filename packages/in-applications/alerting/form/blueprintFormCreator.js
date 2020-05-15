import { metricNameForAlertType } from 'in-applications/alerting/form/thresholdFormData';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType) {
  const threshold = form.get('threshold').toJS();

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

  return form.put('rule', newRuleForm).put('threshold', newThresholdForm);
}

function getThresholdTypeForAlertType(alertType, threshold) {
  return alertType === 'slowness' ? getSlownessThresholdType(threshold) : 'staticThreshold';
}

function getSlownessThresholdType(threshold) {
  return threshold.baseline && threshold.baseline.length > 0 ? 'historicBaseline' : 'staticThreshold';
}
