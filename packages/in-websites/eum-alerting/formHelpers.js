import { onLoadTime, errorRate, statusCodeRate, errorCount, statusCodeCount } from 'in-websites/eum-alerting/constants';
import { getStatusCodeLabel } from 'in-websites/eum-alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { operators } from 'in-analyze/applicationFilter';

const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
};

export function getTitlePlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  if (alertType === alertTypes.specificJsError) {
    const operator = ruleForm.get('operator').value;
    if (operator === operators.NOT_EMPTY) {
      return `Any JS Errors`;
    }
    const errorMessage = ruleForm.get('value').value;
    return `JS Error(s): ${errorMessage}`;
  } else if (alertType === alertTypes.specificStatusCode) {
    const statusCodeString = ruleForm.get('value').value;
    return `HTTP Status Code(s): ${fillStatusCodeValue(statusCodeString)}`;
  } else if (alertType === alertTypes.slowness) {
    const aggregation = ruleForm.get('aggregation').value;
    const operator = form.get('threshold').get('operator').value;
    return `onLoad Time (${getAggregationText(aggregation)}) is too ${isGreaterOperator(operator) ? 'high' : 'low'}`;
  }
  return '';
}

export function getDescriptionPlaceholder(form) {
  const ruleForm = form.get('rule');
  const thresholdForm = form.get('threshold');
  const alertType = ruleForm.get('alertType').value;

  if (alertType === alertTypes.specificJsError) {
    const operator = ruleForm.get('operator').value;
    if (operator === operators.NOT_EMPTY) {
      return `JS Errors have been detected.`;
    }
    return `JS Errors which ${operatorDescriptionValues[operator]} "${
      ruleForm.get('value').value
    }" have been detected.`;
  } else if (alertType === alertTypes.specificStatusCode) {
    const statusCodeString = ruleForm.get('value').value;
    const operator = thresholdForm.get('operator').value;
    return `Occurrences of HTTP Status Code ${getStatusCodeLabel(statusCodeString)} is ${getSimpleOperatorText(
      operator
    )} the expectation.`;
  } else if (alertType === alertTypes.slowness) {
    const aggregation = ruleForm.get('aggregation').value;
    const operator = thresholdForm.get('operator').value;
    const thresholdType = thresholdForm.get('type').value;
    if (thresholdType === 'staticThreshold') {
      const thresholdValue = thresholdForm.get('value').value;
      return `The onLoad Time (${getAggregationText(aggregation)}) is ${getOperatorText(
        operator
      )} ${thresholdValue} ms.`;
    }
    return `The onLoad Time (${getAggregationText(aggregation)}) is ${getSimpleOperatorText(
      operator
    )} the expectation.`;
  }
}

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

export function getThresholdLabel(form) {
  const metricName = form.get('rule').get('metricName').value;
  switch (metricName) {
    case onLoadTime:
      return 'Milliseconds';
    case errorRate:
    case statusCodeRate:
      return 'Percentage';
    case errorCount:
    case statusCodeCount:
      return 'Count';
    default:
      return 'Value';
  }
}

export function isPercentageMetric(metricName) {
  return metricName === errorRate || metricName === statusCodeRate;
}

function fillStatusCodeValue(statusCode) {
  if (statusCode.length === 1) {
    return `${statusCode}XX`;
  } else if (statusCode.length === 2) {
    return `${statusCode}X`;
  }
  return statusCode;
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}

function getSimpleOperatorText(operator) {
  return isGreaterOperator(operator) ? 'above' : 'below';
}

function getOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'greater than';
    case '>=':
      return 'greater or equal to';
    case '<':
      return 'less than';
    case '<=':
      return 'less or equal to';
    default:
      return operator;
  }
}

export function getAggregationText(aggregation) {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return '25th';
    case 'P50':
      return '50th';
    case 'P75':
      return '75th';
    case 'P90':
      return '90th';
    case 'P95':
      return '95th';
    case 'P98':
      return '98th';
    case 'P99':
      return '99th';
    default:
      return aggregation.toLowerCase();
  }
}
