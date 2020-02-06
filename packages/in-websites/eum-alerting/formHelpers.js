import { onLoadTime, errorRate, statusCodeRate, errorCount, statusCodeCount } from 'in-websites/eum-alerting/constants';
import { fieldNames, getStatusCodeLabel } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
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
    const errorMessage = form.get(fieldNames.ruleValue).value;
    return `JS Error(s): ${errorMessage}`;
  } else if (alertType === alertTypes.specificStatusCode) {
    const statusCodeString = form.get(fieldNames.ruleValue).value;
    return `HTTP Status Code(s): ${fillStatusCodeValue(statusCodeString)}`;
  } else if (alertType === alertTypes.slowness) {
    const aggregation = form.get(fieldNames.ruleAggregation).value;
    const operator = form.get(fieldNames.thresholdOperator).value;
    return `onLoad Time (${getAggregationText(aggregation)}) is too ${isGreaterOperator(operator) ? 'high' : 'low'}`;
  }
  return '';
}

export function getDescriptionPlaceholder(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    const errorMessage = form.get(fieldNames.ruleValue).value;
    return `JS Errors which ${operatorDescriptionValues[errorMessage]} "${
      form.get(fieldNames.ruleValue).value
    }" have been detected.`;
  } else if (alertType === alertTypes.specificStatusCode) {
    const statusCodeString = form.get(fieldNames.ruleValue).value;
    const operator = form.get(fieldNames.thresholdOperator).value;
    return `Occurrences of HTTP Status Code ${getStatusCodeLabel(statusCodeString)} is ${getSimpleOperatorText(
      operator
    )} the expectation.`;
  } else if (alertType === alertTypes.slowness) {
    const aggregation = form.get(fieldNames.ruleAggregation).value;
    const operator = form.get(fieldNames.thresholdOperator).value;
    const thresholdType = form.get(fieldNames.thresholdType).value;
    if (thresholdType === 'staticThreshold') {
      const thresholdValue = form.get(fieldNames.thresholdValue).value;
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
  const metricName = form.get(fieldNames.ruleMetricName).value;
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

function getAggregationText(aggregation) {
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
