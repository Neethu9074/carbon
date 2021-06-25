/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { onLoadTime, errorRate, statusCodeRate } from 'in-alerting/smart-alerts/websites/constants';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

export function getTitlePlaceholder(form) {
  const rule = form.get('rule').toJS();
  const alertType = rule.alertType;
  switch (alertType) {
    case 'specificJsError': {
      if (rule.operator === operators.NOT_EMPTY) {
        return t('in-alerting:smartAlerts.websites.form.anyJSErrors');
      }
      const errorMessage = rule.value;
      return t('in-alerting:smartAlerts.websites.form.JSErrors', { errorMessage: errorMessage });
    }
    case 'statusCode': {
      const statusCodeString = rule.value;
      return t('in-alerting:smartAlerts.websites.form.HTTPStatusCodes', {
        statusCode: fillStatusCodeValue(statusCodeString)
      });
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
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedAlertType', { alertType: alertType }));
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
        return t('in-alerting:smartAlerts.websites.form.JSErrorsHaveBeenDetected');
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
      if (thresholdType === STATIC_THRESHOLD) {
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

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = thresholdForm.get('value').value;
        return getStaticThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator, thresholdValue);
      }
      return getThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator);
    }
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedAlertType', { alertType: alertType }));
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
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextEquals', { ruleValue: ruleValue });
    case operators.CONTAINS:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextContains', { ruleValue: ruleValue });
    case operators.STARTS_WITH:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextStartsWith', { ruleValue: ruleValue });
    case operators.ENDS_WITH:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextEndsWith', { ruleValue: ruleValue });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator: operator }));
  }
}

function getSlownessSimpleHighOrLowOperatorText(aggregationText, operator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.slownessSimpleHighOperatorText', { aggregationText: aggregationText })
    : t('in-alerting:smartAlerts.websites.form.slownessSimpleLowOperatorText', { aggregationText: aggregationText });
}

function getThroughputSimpleHighOrLowOperatorText(metricLabel, operator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.throughputSimpleHighOperatorText', { metricLabel: metricLabel })
    : t('in-alerting:smartAlerts.websites.form.throughputSimpleLowOperatorText', { metricLabel: metricLabel });
}

function getStatusCodeSimpleAboveOrBelowOperatorText(statusCodeLabel, operator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.statusCodeSimpleAboveOperatorText', { statusCodeLabel: statusCodeLabel })
    : t('in-alerting:smartAlerts.websites.form.statusCodeSimpleBelowOperatorText', {
        statusCodeLabel: statusCodeLabel
      });
}

function getSlownessSimpleAboveOrBelowOperatorText(aggregationText, operator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.slownessSimpleAboveOperatorText', { aggregationText: aggregationText })
    : t('in-alerting:smartAlerts.websites.form.slownessSimpleBelowOperatorText', { aggregationText: aggregationText });
}

function getSlownessGreaterOrLessOperatorText(aggregationText, operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.slownessGreaterOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.slownessGreaterEqualsOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.slownessLessOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.slownessLessEqualsOperatorText', {
        aggregationText: aggregationText,
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator: operator }));
  }
}

function getStaticThresholdHigherOrLowerOperatorText(metricLabel, operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdHigherOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdHigherEqualsOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdLowerOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdLowerEqualsOperatorText', {
        metricLabel: metricLabel,
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator: operator }));
  }
}

function getThresholdHigherOrLowerOperatorText(metricLabel, operator) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.thresholdHigherOperatorText', { metricLabel: metricLabel });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.thresholdHigherEqualsOperatorText', { metricLabel: metricLabel });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.thresholdLowerOperatorText', { metricLabel: metricLabel });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.thresholdLowerEqualsOperatorText', { metricLabel: metricLabel });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator: operator }));
  }
}
