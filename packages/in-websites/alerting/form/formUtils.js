import { onLoadTime, errorRate, statusCodeRate } from 'in-websites/alerting/constants';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getStatusCodeLabel } from 'in-websites/alerting/form/ruleFormData';
import { operators } from 'in-analyze/applicationFilter';

const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
};

export function getTitlePlaceholder(form) {
  const rule = form.get('rule').toJS();
  const alertType = rule.alertType;
  switch (alertType) {
    case 'specificJsError': {
      if (rule.operator === operators.NOT_EMPTY) {
        return `Any JS Errors`;
      }
      const errorMessage = rule.value;
      return `JS Error(s): "${errorMessage}"`;
    }
    case 'statusCode': {
      const statusCodeString = rule.value;
      return `HTTP Status Code(s): ${fillStatusCodeValue(statusCodeString)}`;
    }
    case 'slowness': {
      const thresholdOperator = form.get('threshold').get('operator').value;
      return `onLoad Time (${getAggregationText(rule.aggregation)}) is too ${getSimpleHighOrLowOperatorText(
        thresholdOperator
      )}`;
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig.getMetricName(rule);
      const thresholdOperator = form.get('threshold').get('operator').value;
      return `Number of ${blueprintConfig.getMetricLabel(metricName)} is anomalously ${getSimpleHighOrLowOperatorText(
        thresholdOperator
      )}`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

export function getDescriptionPlaceholder(form) {
  const rule = form.get('rule').toJS();
  const alertType = rule.alertType;
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;

  switch (alertType) {
    case 'specificJsError': {
      if (rule.operator === operators.NOT_EMPTY) {
        return `JS Errors have been detected.`;
      }
      return `JS Errors which ${operatorDescriptionValues[rule.operator]} "${rule.value}" have been detected.`;
    }
    case 'statusCode': {
      const statusCodeString = rule.value;
      return `Occurrences of HTTP Status Code ${getStatusCodeLabel(
        statusCodeString
      )} is ${getSimpleAboveOrBelowOperatorText(thresholdOperator)} the expectation.`;
    }
    case 'slowness': {
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return `The onLoad Time (${getAggregationText(rule.aggregation)}) is ${getGreaterOrLessOperatorText(
          thresholdOperator
        )} ${thresholdValue} ms.`;
      }
      return `The onLoad Time (${getAggregationText(rule.aggregation)}) is ${getSimpleAboveOrBelowOperatorText(
        thresholdOperator
      )} the expectation.`;
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig.getMetricName(rule);
      const metricLabel = blueprintConfig.getMetricLabel(metricName);
      const thresholdType = thresholdForm.get('type').value;

      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return `The number of ${metricLabel} is ${getHigherOrLowerOperatorText(thresholdOperator)} ${thresholdValue}.`;
      }
      return `The number of ${metricLabel} is ${getHigherOrLowerOperatorText(thresholdOperator)} expected.`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

export function getMetricUnitPostfix(metricName) {
  switch (metricName) {
    case onLoadTime:
      return 'ms';
    case errorRate:
    case statusCodeRate:
      return '%';
    default:
      return '';
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

function getHigherOrLowerOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'higher than';
    case '>=':
      return 'higher or equal to';
    case '<':
      return 'lower than';
    case '<=':
      return 'lower or equal to';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

function getSimpleAboveOrBelowOperatorText(operator) {
  return isGreaterOperator(operator) ? 'above' : 'below';
}

function getSimpleHighOrLowOperatorText(operator) {
  return isGreaterOperator(operator) ? 'high' : 'low';
}
