/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { onLoadTime, errorRate, statusCodeRate } from 'in-websites/alerting/constants';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getStatusCodeLabel } from 'in-websites/alerting/form/ruleFormData';
import { operators } from 'in-analyze/applicationFilter';

export function getTitlePlaceholder(form) {
  const rule = form.get('rule').toJS();
  const alertType = rule.alertType;
  switch (alertType) {
    case 'specificJsError': {
      if (rule.operator === operators.NOT_EMPTY) {
        return t('in-websites:alerting.form.anyJSErrors');
      }
      const errorMessage = rule.value;
      return t('in-websites:alerting.form.JSErrors', { errorMessage: errorMessage });
    }
    case 'statusCode': {
      const statusCodeString = rule.value;
      return t('in-websites:alerting.form.HTTPStatusCodes', { statusCode: fillStatusCodeValue(statusCodeString) });
    }
    case 'slowness': {
      const thresholdOperator = form.get('threshold').get('operator').value;
      return getSlownessSimpleHighOrLowOperatorText(getAggregationText(rule.aggregation), thresholdOperator);
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig.getMetricName(rule);
      const thresholdOperator = form.get('threshold').get('operator').value;
      return getThroughputSimpleHighOrLowOperatorText(blueprintConfig.getMetricLabel(metricName), thresholdOperator);
    }
    default:
      throw Error(t('in-websites:alerting.form.unsupportedAlertType', { alertType: alertType }));
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
        return t('in-websites:alerting.form.JSErrorsHaveBeenDetected');
      }
      return getJSErrorText(rule.operator, rule.value);
    }
    case 'statusCode': {
      const statusCodeString = rule.value;
      return getStatusCodeSimpleAboveOrBelowOperatorText(getStatusCodeLabel(statusCodeString), thresholdOperator);
    }
    case 'slowness': {
      const thresholdType = thresholdForm.get('type').value;
      const aggregationText = getAggregationText(rule.aggregation);
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return getSlownessGreaterOrLessOperatorText(aggregationText, thresholdOperator, thresholdValue);
      }
      return getSlownessSimpleAboveOrBelowOperatorText(aggregationText, thresholdOperator);
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig.getMetricName(rule);
      const metricLabel = blueprintConfig.getMetricLabel(metricName);
      const thresholdType = thresholdForm.get('type').value;

      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return getStaticThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator, thresholdValue);
      }
      return getThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator);
    }
    default:
      throw Error(t('in-websites:alerting.form.unsupportedAlertType', { alertType: alertType }));
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

function getJSErrorText(operator, ruleValue) {
  switch (operator) {
    case operators.EQUALS:
      return t('in-websites:alerting.form.JSErrorTextEquals', { ruleValue: ruleValue });
    case operators.CONTAINS:
      return t('in-websites:alerting.form.JSErrorTextContains', { ruleValue: ruleValue });
    case operators.STARTS_WITH:
      return t('in-websites:alerting.form.JSErrorTextStartsWith', { ruleValue: ruleValue });
    case operators.ENDS_WITH:
      return t('in-websites:alerting.form.JSErrorTextEndsWith', { ruleValue: ruleValue });
    default:
      throw Error(t('in-websites:alerting.form.unsupportedOperator', { operator: operator }));
  }
}

function getSlownessSimpleHighOrLowOperatorText(aggregationText, operator) {
  return isGreaterOperator(operator)
    ? t('in-websites:alerting.form.slownessSimpleHighOperatorText', { aggregationText: aggregationText })
    : t('in-websites:alerting.form.slownessSimpleLowOperatorText', { aggregationText: aggregationText });
}

function getThroughputSimpleHighOrLowOperatorText(metricLabel, operator) {
  return isGreaterOperator(operator)
    ? t('in-websites:alerting.form.throughputSimpleHighOperatorText', { metricLabel: metricLabel })
    : t('in-websites:alerting.form.throughputSimpleLowOperatorText', { metricLabel: metricLabel });
}

function getStatusCodeSimpleAboveOrBelowOperatorText(statusCodeLabel, operator) {
  return isGreaterOperator(operator)
    ? t('in-websites:alerting.form.statusCodeSimpleAboveOperatorText', { statusCodeLabel: statusCodeLabel })
    : t('in-websites:alerting.form.statusCodeSimpleBelowOperatorText', { statusCodeLabel: statusCodeLabel });
}

function getSlownessSimpleAboveOrBelowOperatorText(aggregationText, operator) {
  return isGreaterOperator(operator)
    ? t('in-websites:alerting.form.slownessSimpleAboveOperatorText', { aggregationText: aggregationText })
    : t('in-websites:alerting.form.slownessSimpleBelowOperatorText', { aggregationText: aggregationText });
}

function getSlownessGreaterOrLessOperatorText(aggregationText, operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-websites:alerting.form.slownessGreaterOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-websites:alerting.form.slownessGreaterEqualsOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-websites:alerting.form.slownessLessOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-websites:alerting.form.slownessLessEqualsOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-websites:alerting.form.unsupportedOperator', { operator: operator }));
  }
}

function getStaticThresholdHigherOrLowerOperatorText(metricLabel, operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-websites:alerting.form.staticThresholdHigherOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-websites:alerting.form.staticThresholdHigherEqualsOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-websites:alerting.form.staticThresholdLowerOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-websites:alerting.form.staticThresholdLowerEqualsOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-websites:alerting.form.unsupportedOperator', { operator: operator }));
  }
}

function getThresholdHigherOrLowerOperatorText(metricLabel, operator) {
  switch (operator) {
    case '>':
      return t('in-websites:alerting.form.thresholdHigherOperatorText', { metricLabel: metricLabel });
    case '>=':
      return t('in-websites:alerting.form.thresholdHigherEqualsOperatorText', { metricLabel: metricLabel });
    case '<':
      return t('in-websites:alerting.form.thresholdLowerOperatorText', { metricLabel: metricLabel });
    case '<=':
      return t('in-websites:alerting.form.thresholdLowerEqualsOperatorText', { metricLabel: metricLabel });
    default:
      throw Error(t('in-websites:alerting.form.unsupportedOperator', { operator: operator }));
  }
}
