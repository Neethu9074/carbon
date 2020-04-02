import { createSlownessForm, createErrorRateForm } from 'in-applications/alerting/form/thresholdForm';
import { metricNameForAlertType } from './thresholdFormData';

export default function createBlueprintForm(form, alertType) {
  const threshold = form.get('threshold').toJS();
  let newForm = form
    .updateIn(['rule', 'alertType'], f => f.setValue(alertType).setTouched())
    .updateIn(['rule', 'metricName'], f => f.setValue(metricNameForAlertType[alertType]).setTouched())
    .updateIn(['threshold', 'type'], f => f.setValue(getThresholdTypeForAlertType(alertType, threshold)).setTouched());

  // reset value fields to prevent displaying the old value in the input field until the new one has arrived
  if (newForm.get('threshold').containsKey('value')) {
    newForm = newForm.updateIn(['threshold', 'value'], f => f.setValue(null).setTouched());
  }

  if (alertType === 'errorRate') {
    return newForm.put('threshold', createErrorRateForm(newForm.get('threshold').toJS()));
  }

  if (alertType === 'slowness') {
    return newForm.put('threshold', createSlownessForm(newForm.get('threshold').toJS()));
  }
}

function getThresholdTypeForAlertType(alertType, threshold) {
  if (alertType === 'errorRate') {
    return 'staticThreshold';
  }
  if (alertType === 'slowness') {
    return getSlownessThresholdType(threshold);
  }
}

function getSlownessThresholdType(threshold) {
  if (threshold.baseline && threshold.baseline.length > 0) {
    return 'historicBaseline.DAILY';
  }
  return 'staticThreshold';
}
