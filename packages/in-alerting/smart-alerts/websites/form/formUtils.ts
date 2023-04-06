/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { CustomEventWebsiteAlertRule } from '@instana/types';

import {
  SlownessWebsiteAlertRule,
  SpecificJsErrorsWebsiteAlertRule,
  StatusCodeWebsiteAlertRule,
  TagFilterOperator,
  ThresholdOperator,
  ThresholdType,
  ThroughputWebsiteAlertRule,
  WebsiteAlertRule
} from 'in-types';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { errorRate, onLoadTime, statusCodeRate } from 'in-alerting/smart-alerts/websites/constants';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

export function getTitlePlaceholder(form: MapForm<any>) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as WebsiteAlertRule;
  const alertType = rule.alertType;

  switch (alertType) {
    case 'specificJsError': {
      if ((rule as SpecificJsErrorsWebsiteAlertRule).operator === operators.NOT_EMPTY) {
        return t('in-alerting:smartAlerts.websites.form.anyJSErrors');
      }
      const errorMessage = (rule as SpecificJsErrorsWebsiteAlertRule).value;
      return t('in-alerting:smartAlerts.websites.form.JSErrors', { errorMessage: errorMessage });
    }
    case 'statusCode': {
      const statusCodeString = (rule as StatusCodeWebsiteAlertRule).value;
      return t('in-alerting:smartAlerts.websites.form.HTTPStatusCodes', {
        statusCode: fillStatusCodeValue(statusCodeString)
      });
    }
    case 'slowness': {
      const thresholdOperator = ((form.get('threshold') as MapForm<any>).get('operator') as Field<ThresholdOperator>)
        .value;
      return getSlownessSimpleHighOrLowOperatorText(
        getAggregationText((rule as SlownessWebsiteAlertRule).aggregation),
        thresholdOperator
      );
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig!.getMetricName(rule as WebsiteAlertRule);
      const thresholdOperator = ((form.get('threshold') as MapForm<any>).get('operator') as Field<ThresholdOperator>)
        .value;
      return getThroughputSimpleHighOrLowOperatorText(
        blueprintConfig!.getMetricLabel(metricName as MetricName),
        thresholdOperator
      );
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventWebsiteAlertRule).customEventName;
      return t('in-alerting:smartAlerts.websites.form.customEvents', { customEventName });
    }
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedAlertType', { alertType: alertType }));
  }
}

export function getDescriptionPlaceholder(form: MapForm<any>) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as WebsiteAlertRule;
  const alertType = rule.alertType;
  const thresholdForm = form.get('threshold') as MapForm<any>;

  const thresholdOperator = (thresholdForm.get('operator') as Field<ThresholdOperator>).value;

  switch (alertType) {
    case 'specificJsError': {
      const specificJsErrorRule = rule as SpecificJsErrorsWebsiteAlertRule;
      if (specificJsErrorRule.operator === operators.NOT_EMPTY) {
        return t('in-alerting:smartAlerts.websites.form.JSErrorsHaveBeenDetected');
      }
      return getJSErrorText(specificJsErrorRule.operator, specificJsErrorRule.value);
    }
    case 'statusCode': {
      const statusCodeRule = rule as StatusCodeWebsiteAlertRule;
      const statusCodeString = statusCodeRule.value;
      return getStatusCodeSimpleAboveOrBelowOperatorText(getStatusCodeLabel(statusCodeString), thresholdOperator);
    }
    case 'slowness': {
      const slownessRule = rule as SlownessWebsiteAlertRule;
      const thresholdType = (thresholdForm.get('type') as Field<ThresholdType>).value;
      const aggregationText = getAggregationText(slownessRule.aggregation);
      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = (thresholdForm.get('value') as Field<number>).value;
        return getSlownessGreaterOrLessOperatorText(aggregationText, thresholdOperator, thresholdValue);
      }
      return getSlownessSimpleAboveOrBelowOperatorText(aggregationText, thresholdOperator);
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig!.getMetricName(rule as ThroughputWebsiteAlertRule);
      const metricLabel = blueprintConfig!.getMetricLabel(metricName as MetricName);
      const thresholdType = (thresholdForm.get('type') as Field<ThresholdType>).value;

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = (thresholdForm.get('value') as Field<number>).value;
        return getStaticThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator, thresholdValue);
      }
      return getThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator);
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventWebsiteAlertRule).customEventName;

      return t('in-alerting:smartAlerts.websites.form.customEventsText', { customEventName });
    }
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedAlertType', { alertType: alertType }));
  }
}

export function getMetricUnitPostfix(metricName: string) {
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

export function isPercentageMetric(metricName: string) {
  return metricName === errorRate || metricName === statusCodeRate;
}

function fillStatusCodeValue(statusCode: string) {
  if (statusCode.length === 1) {
    return `${statusCode}XX`;
  } else if (statusCode.length === 2) {
    return `${statusCode}X`;
  }
  return statusCode;
}

function getJSErrorText(operator: TagFilterOperator, ruleValue?: string) {
  switch (operator) {
    case operators.EQUALS:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextEquals', { ruleValue });
    case operators.CONTAINS:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextContains', { ruleValue });
    case operators.STARTS_WITH:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextStartsWith', { ruleValue });
    case operators.ENDS_WITH:
      return t('in-alerting:smartAlerts.websites.form.JSErrorTextEndsWith', { ruleValue });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator }));
  }
}

function getSlownessSimpleHighOrLowOperatorText(aggregationText: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.slownessSimpleHighOperatorText', { aggregationText })
    : t('in-alerting:smartAlerts.websites.form.slownessSimpleLowOperatorText', { aggregationText });
}

function getThroughputSimpleHighOrLowOperatorText(metricLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.throughputSimpleHighOperatorText', { metricLabel })
    : t('in-alerting:smartAlerts.websites.form.throughputSimpleLowOperatorText', { metricLabel });
}

function getStatusCodeSimpleAboveOrBelowOperatorText(statusCodeLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.statusCodeSimpleAboveOperatorText', { statusCodeLabel })
    : t('in-alerting:smartAlerts.websites.form.statusCodeSimpleBelowOperatorText', {
        statusCodeLabel
      });
}

function getSlownessSimpleAboveOrBelowOperatorText(aggregationText: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.websites.form.slownessSimpleAboveOperatorText', { aggregationText })
    : t('in-alerting:smartAlerts.websites.form.slownessSimpleBelowOperatorText', { aggregationText });
}

function getSlownessGreaterOrLessOperatorText(
  aggregationText: string,
  operator: ThresholdOperator,
  thresholdValue: number
) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.slownessGreaterOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.slownessGreaterEqualsOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.slownessLessOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.slownessLessEqualsOperatorText', {
        aggregationText,
        thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator: operator }));
  }
}

function getStaticThresholdHigherOrLowerOperatorText(
  metricLabel: string,
  operator: ThresholdOperator,
  thresholdValue: string | number
) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdHigherOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdHigherEqualsOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdLowerOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.staticThresholdLowerEqualsOperatorText', {
        metricLabel,
        thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator }));
  }
}

function getThresholdHigherOrLowerOperatorText(metricLabel: string, operator: ThresholdOperator) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.websites.form.thresholdHigherOperatorText', { metricLabel });
    case '>=':
      return t('in-alerting:smartAlerts.websites.form.thresholdHigherEqualsOperatorText', { metricLabel });
    case '<':
      return t('in-alerting:smartAlerts.websites.form.thresholdLowerOperatorText', { metricLabel });
    case '<=':
      return t('in-alerting:smartAlerts.websites.form.thresholdLowerEqualsOperatorText', { metricLabel });
    default:
      throw Error(t('in-alerting:smartAlerts.websites.form.unsupportedOperator', { operator }));
  }
}
