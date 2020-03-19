import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/eum-alerting/formHelpers';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';

export default function toAlertConfig(form) {
  return Object.freeze({
    rule: {
      alertType: form.get(fieldNames.ruleAlertType).value,
      metricName: form.get(fieldNames.ruleMetricName).value,
      ...enrichByAlertType(form)
    },
    tagFilters: form.get(fieldNames.tagFilters).value,
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: getThreshold(form),
    timeThreshold: getTimeThreshold(form)
  });
}

export function getThreshold(form) {
  return {
    operator: form.get(fieldNames.thresholdOperator).value,
    lastUpdated: form.get(fieldNames.thresholdLastUpdated).value,
    ...enrichByThresholdType(form)
  };
}

function getTimeThreshold(form) {
  const timeThresholdForm = form.get('timeThreshold');
  const hiddenFieldsForm = form.get('hiddenFields');
  const timeThreshold = timeThresholdForm.toJS();

  if (timeThresholdForm.get('type').value === timeThresholdTypes.userImpactOfViolationsInSequence) {
    timeThreshold['users'] = hiddenFieldsForm.get('alertByNumberOfImpactedUsersEnabled').value
      ? timeThresholdForm.get(fieldNames.timeThresholdUsers).value
      : null;

    timeThreshold['userPercentage'] = hiddenFieldsForm.get('alertByPercentageOfImpactedUsersEnabled').value
      ? timeThresholdForm.get(fieldNames.timeThresholdUserPercentage).value
      : null;
  }

  return timeThreshold;
}

export function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}

function enrichByAlertType(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === alertTypes.specificJsError) {
    return {
      operator: form.get(fieldNames.ruleOperator).value,
      value: form.get(fieldNames.ruleValue).value
    };
  }

  if (alertType === alertTypes.specificStatusCode) {
    return {
      operator: form.get(fieldNames.ruleOperator).value,
      value: form.get(fieldNames.ruleValue).value
    };
  }

  if (alertType === alertTypes.slowness) {
    return {
      aggregation: form.get(fieldNames.ruleAggregation).value
    };
  }

  return null;
}

function enrichByThresholdType(form) {
  const thresholdType = form.get(fieldNames.thresholdType).value;
  if (thresholdType === 'staticThreshold') {
    return {
      type: 'staticThreshold',
      value: form.get(fieldNames.thresholdValue).value
    };
  } else {
    return {
      type: 'historicBaseline',
      seasonality: form.get(fieldNames.thresholdSeasonality).value,
      baseline: form.get(fieldNames.thresholdBaseline).value,
      deviationFactor: form.get(fieldNames.thresholdDeviationFactor).value
    };
  }
}
