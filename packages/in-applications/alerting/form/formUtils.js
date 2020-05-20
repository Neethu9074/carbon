import {
  ruleMetricNameOptions,
  getLogLevelRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-applications/alerting/form/ruleFormData';
import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
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
      throw Error('Unsupported alertType: ' + alertType);
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
      return 'Erroneous call rate is higher than normal';
    case 'slowness':
      return 'Calls are slower than usual';
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;

      if (ruleOperator === operators.NOT_EMPTY) {
        if (level === 'ANY') {
          return 'Too many calls logging messages';
        }
        return `Too many calls logging ${getLogLevelRuleOperatorLabel(level)} messages`;
      }

      if (level === 'ANY') {
        return `Too many calls logging messages: "${message}"`;
      }
      return `Too many calls logging ${getLogLevelRuleOperatorLabel(level)} messages: "${message}"`;
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCodeEnd').value;
      return `Too many calls with HTTP Status Code ${getStatusCodeShortText(statusCodeStart, statusCodeEnd)}`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

export function getDescriptionPlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  switch (alertType) {
    case 'errorRate': {
      const thresholdValue = thresholdForm.get('value').value;
      return `The erroneous call rate is ${getHigherOrLowerOperatorText(thresholdOperator)} ${getValueRoundedToDecimals(
        thresholdValue,
        true
      )}%.`;
    }
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return `Calls are ${getSlowerOrBelowOperatorText(
          thresholdOperator
        )} ${thresholdValue} ms based on latency (${getAggregationText(aggregation)}).`;
      }
      return `Calls are ${getSlowerOrBelowOperatorText(
        thresholdOperator
      )} the expectation based on latency (${getAggregationText(aggregation)}).`;
    }
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;
      const levelText = getLogLevelRuleOperatorLabel(level);
      const operator = thresholdForm.get('operator').value;
      const thresholdValue = thresholdForm.get('value').value;

      if (operator === operators.NOT_EMPTY) {
        return `Number of calls logging ${levelText} messages is ${getHigherOrLowerOperatorText(
          operator
        )} ${thresholdValue}.`;
      }
      return `Number of calls logging ${levelText} messages which ${
        operatorDescriptionValues[ruleOperator]
      } "${message}" is ${getHigherOrLowerOperatorText(operator)} ${thresholdValue}.`;
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCodeEnd').value;
      const thresholdForm = form.get('threshold');
      const thresholdValue = thresholdForm.get('value').value;
      return `Occurrences of HTTP Status Code ${getStatusCodeFullText(
        statusCodeStart,
        statusCodeEnd
      )} is ${getHigherOrLowerOperatorText(thresholdOperator)} ${thresholdValue}.`;
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

function getStatusCodeShortText(statusCodeStart, statusCodeEnd) {
  if (statusCodeStart === statusCodeEnd) {
    return statusCodeStart.toString();
  } else if (statusCodeStart % 100 === 0 && statusCodeEnd - statusCodeStart === 99) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return `${parseInt(statusCodeStart / 100).toString()}XX`;
  } else {
    // custom ranges
    return `${statusCodeStart} - ${statusCodeEnd}`;
  }
}

function getStatusCodeFullText(statusCodeStart, statusCodeEnd) {
  if (statusCodeStart === statusCodeEnd) {
    return getStatusCodeLabel(statusCodeStart.toString());
  } else if (statusCodeStart % 100 === 0 && statusCodeEnd - statusCodeStart === 99) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return getStatusCodeLabel(parseInt(statusCodeStart / 100).toString());
  } else {
    // custom ranges
    return `between ${statusCodeStart} and ${statusCodeEnd}`;
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

function getSlowerOrBelowOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'slower than';
    case '>=':
      return 'slower or equal to';
    case '<':
      return 'below';
    case '<=':
      return 'below or equal to';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

export function findEntryByValue(valueLabelPairList, value) {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}
