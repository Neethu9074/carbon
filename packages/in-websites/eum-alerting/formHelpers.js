import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { operators } from 'in-analyze/applicationFilter';

const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
};

export function getTitlePlaceholder(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return `JS Error(s): ${form.get(fieldNames.ruleValue).value}`;
  }
  if (alertType === alertTypes.slowness) {
    return `onLoad time to high`;
  }
}

export function getDescriptionPlaceholder(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return `JS Errors which ${operatorDescriptionValues[form.get(fieldNames.ruleOperator).value]} "${
      form.get(fieldNames.ruleValue).value
    }" have been detected.`;
  }
  if (alertType === alertTypes.slowness) {
    return `Load times above specified threshold detected.`;
  }
}

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}
