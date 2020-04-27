import { onLoadTime, errorRate, statusCodeRate, errorCount, statusCodeCount } from 'in-websites/alerting/constants';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { getStatusCodeLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
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
  switch (alertType) {
    case alertTypes.specificJsError: {
      const operator = ruleForm.get('operator').value;
      if (operator === operators.NOT_EMPTY) {
        return `Any JS Errors`;
      }
      const errorMessage = ruleForm.get('value').value;
      return `JS Error(s): "${errorMessage}"`;
    }
    case alertTypes.specificStatusCode: {
      const statusCodeString = ruleForm.get('value').value;
      return `HTTP Status Code(s): ${fillStatusCodeValue(statusCodeString)}`;
    }
    case alertTypes.slowness: {
      const aggregation = ruleForm.get('aggregation').value;
      const operator = form.get('threshold').get('operator').value;
      return `onLoad Time (${getAggregationText(aggregation)}) is too ${isGreaterOperator(operator) ? 'high' : 'low'}`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

export function getDescriptionPlaceholder(form) {
  const ruleForm = form.get('rule');
  const thresholdForm = form.get('threshold');
  const alertType = ruleForm.get('alertType').value;

  switch (alertType) {
    case alertTypes.specificJsError: {
      const ruleOperator = ruleForm.get('operator').value;
      if (ruleOperator === operators.NOT_EMPTY) {
        return `JS Errors have been detected.`;
      }
      return `JS Errors which ${operatorDescriptionValues[ruleOperator]} "${
        ruleForm.get('value').value
      }" have been detected.`;
    }
    case alertTypes.specificStatusCode: {
      const statusCodeString = ruleForm.get('value').value;
      const operator = thresholdForm.get('operator').value;
      return `Occurrences of HTTP Status Code ${getStatusCodeLabel(
        statusCodeString
      )} is ${getSimpleAboveOrBelowOperatorText(operator)} the expectation.`;
    }
    case alertTypes.slowness: {
      const aggregation = ruleForm.get('aggregation').value;
      const operator = thresholdForm.get('operator').value;
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return `The onLoad Time (${getAggregationText(aggregation)}) is ${getGreaterOrLessOperatorText(
          operator
        )} ${thresholdValue} ms.`;
      }
      return `The onLoad Time (${getAggregationText(aggregation)}) is ${getSimpleAboveOrBelowOperatorText(
        operator
      )} the expectation.`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
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

function getGreaterOrLessOperatorText(operator) {
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
      throw Error('Unsupported operator: ' + operator);
  }
}

function getSimpleAboveOrBelowOperatorText(operator) {
  return isGreaterOperator(operator) ? 'above' : 'below';
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
