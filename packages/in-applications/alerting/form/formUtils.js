import {
  ruleMetricNameOptions,
  getLogLevelRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-applications/alerting/form/ruleFormData';
import { isGreaterOperator, getAggregationText, getOperatorText } from 'in-new-components/Alerting/utils/formUtils';
import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { operators } from 'in-analyze/applicationFilter';

const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
};

export function getBlueprintLabel(alertType) {
  switch (alertType) {
    case 'errorRate':
      return 'Error Rate';
    case 'slowness':
      return 'Slowness';
    case 'logs':
      return 'Log Message';
    case 'statusCode':
      return 'Status Code';
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
    case 'calls':
      return 'Count';
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
    case 'logs': {
      const message = ruleForm.get('message').value;
      const operator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;
      if (operator === operators.NOT_EMPTY) {
        if (level === 'ANY') {
          return 'Any Log Message';
        }
        return `Any ${getLogLevelRuleOperatorLabel(level)} Log Message`;
      }

      if (level === 'ANY') {
        return `Log Messages: ${message}`;
      }
      return `${getLogLevelRuleOperatorLabel(level)} Log Messages: ${message}`;
    }
    case 'statusCode': {
      const value = ruleForm.get('value').value;
      const operator = ruleForm.get('operator').value;
      return `Occurrences of HTTP Status Code ${getStatusCodeLabel(value)} is ${getSimpleOperatorText(
        operator
      )} the expectation.`;
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
    case 'logs': {
      const message = ruleForm.get('message').value;
      const operator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;
      const levelText = getLogLevelRuleOperatorLabel(level);
      if (operator === operators.NOT_EMPTY) {
        return `${levelText} log messages have been detected.`;
      }
      return `${levelText} log messages which ${operatorDescriptionValues[operator]} "${message}" have been detected.`;
    }
    case 'statusCode': {
      const value = ruleForm.get('value').value;
      const operator = ruleForm.get('operator').value;
      return `HTTP Status codes which ${operatorDescriptionValues[operator]} "${value}" have been detected.`;
    }
    default:
      return '';
  }
}

function getSimpleOperatorText(operator) {
  return isGreaterOperator(operator) ? 'above' : 'below';
}
