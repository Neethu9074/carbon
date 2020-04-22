import { metricNameForAlertType } from 'in-websites/alerting/form/thresholdFormData';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

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
      .toJS(),
    alertType,
    metricName: metricNameForAlertType[alertType]
  });

  return form.put('rule', newRuleForm).put('threshold', newThresholdForm);
}

function getThresholdTypeForAlertType(alertType, threshold) {
  if (alertType === 'specificJsError' || alertType === 'statusCode') {
    return 'staticThreshold';
  }
  if (alertType === 'slowness') {
    return getSlownessThresholdType(threshold);
  }
}

function getSlownessThresholdType(threshold) {
  return threshold.baseline && threshold.baseline.length > 0 ? 'historicBaseline' : 'staticThreshold';
}
