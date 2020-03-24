import { metricNameForAlertType } from 'in-websites/eum-alerting/form/thresholdFormData';
import createThresholdForm from 'in-websites/eum-alerting/form/thresholdForm';
import createRuleForm from 'in-websites/eum-alerting/form/ruleForm';

export default function createBlueprintForm(form, alertType) {
  const newThresholdForm = createThresholdForm(
    {
      ...form.get('threshold').toJS(),
      type: getThresholdTypeForAlertType(alertType)
    },
    alertType
  );

  const newRuleForm = createRuleForm(
    {
      ...form
        .get('rule')
        .remove('operator')
        .remove('value')
        .toJS(),
      alertType,
      metricName: metricNameForAlertType[alertType]
    },
    newThresholdForm.get('type').value
  );

  return form.put('rule', newRuleForm).put('threshold', newThresholdForm);
}

function getThresholdTypeForAlertType(alertType, threshold) {
  if (alertType === 'specificJsError' || 'statusCode') {
    return 'staticThreshold';
  }
  if (alertType === 'slowness') {
    return getSlownessThresholdType(threshold);
  }
}

function getSlownessThresholdType(threshold) {
  const isBaselineDaily =
    !threshold.type.includes('historicBaseline.') && (!threshold.baseline || threshold.baseline?.value?.length > 0);

  if (isBaselineDaily) {
    return 'historicBaseline.DAILY';
  } else {
    return threshold.type;
  }
}
