import { isGreaterOperator, getAggregationText, getOperatorText } from 'in-new-components/Alerting/utils/formUtils';
import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { ruleMetricNameOptions } from 'in-applications/alerting/form/ruleFormData';

export function getBlueprintLabel(alertType) {
  switch (alertType) {
    case 'errorRate':
      return 'Error Rate';
    case 'slowness':
      return 'Slowness';
    case 'logs':
      return 'Log Message';
    default:
      return '';
  }
}

export function getMetricLabel(alertType, value) {
  const metricList = ruleMetricNameOptions[alertType];

  if (!metricList) {
    return '';
  }

  return metricList.filter(entry => entry.value === value)[0].label;
}

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

export function getThresholdLabel(form) {
  const metricName = form.get('rule').get('metricName').value;
  switch (metricName) {
    case 'latency':
      return 'Milliseconds';
    case 'errors':
      return 'Percentage';
    default:
      return 'Value';
  }
}

export function getTitlePlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  switch (alertType) {
    case 'errorRate':
      return `Error Rate is higher than expected`;
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;
      const operator = form.get('threshold').get('operator').value;
      return `Latency (${getAggregationText(aggregation)}) is too ${isGreaterOperator(operator) ? 'high' : 'low'}`;
    }
    default:
      return '';
  }
}

export function getDescriptionPlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdForm = form.get('threshold');
  const operator = thresholdForm.get('operator').value;
  switch (alertType) {
    case 'errorRate': {
      const thresholdValue = thresholdForm.get('value').value;
      return `The error rate is ${getOperatorText(operator)} ${getValueRoundedToDecimals(thresholdValue, true)}%.`;
    }
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return `The latency (${getAggregationText(aggregation)}) is ${getOperatorText(operator)} ${thresholdValue} ms.`;
      }
      return `The latency (${getAggregationText(aggregation)}) is ${getSimpleOperatorText(operator)} the expectation.`;
    }
    default:
      return '';
  }
}

function getSimpleOperatorText(operator) {
  return isGreaterOperator(operator) ? 'above' : 'below';
}
