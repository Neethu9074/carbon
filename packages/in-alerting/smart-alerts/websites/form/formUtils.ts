/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { CustomEventWebsiteAlertRule } from '@instana/types';

import {
  getStaticThresholdHigherOrLowerOperatorText,
  getStatusCodeSimpleAboveOrBelowOperatorText,
  getThresholdHigherOrLowerOperatorText,
  getThroughputSimpleHighOrLowOperatorText
} from 'in-alerting/smart-alerts/eum/form/formUtils';
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
        return t('in-alerting:smartAlerts.eum.form.anyJSErrors');
      }
      const errorMessage = (rule as SpecificJsErrorsWebsiteAlertRule).value;
      return t('in-alerting:smartAlerts.eum.form.JSErrors', { errorMessage: errorMessage });
    }
    case 'statusCode': {
      const statusCodeString = (rule as StatusCodeWebsiteAlertRule).value;
      return t('in-alerting:smartAlerts.eum.form.HTTPStatusCodes', {
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
      return t('in-alerting:smartAlerts.eum.form.customEvents', { customEventName });
    }
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedAlertType', { alertType: alertType }));
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
        return t('in-alerting:smartAlerts.eum.form.JSErrorsHaveBeenDetected');
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

      return t('in-alerting:smartAlerts.eum.form.customEventsText', { customEventName });
    }
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedAlertType', { alertType: alertType }));
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
      return t('in-alerting:smartAlerts.eum.form.JSErrorTextEquals', { ruleValue });
    case operators.CONTAINS:
      return t('in-alerting:smartAlerts.eum.form.JSErrorTextContains', { ruleValue });
    case operators.STARTS_WITH:
      return t('in-alerting:smartAlerts.eum.form.JSErrorTextStartsWith', { ruleValue });
    case operators.ENDS_WITH:
      return t('in-alerting:smartAlerts.eum.form.JSErrorTextEndsWith', { ruleValue });
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedOperator', { operator }));
  }
}

function getSlownessSimpleHighOrLowOperatorText(aggregationText: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.slownessSimpleHighOperatorText', { aggregationText })
    : t('in-alerting:smartAlerts.eum.form.slownessSimpleLowOperatorText', { aggregationText });
}

function getSlownessSimpleAboveOrBelowOperatorText(aggregationText: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.slownessSimpleAboveOperatorText', { aggregationText })
    : t('in-alerting:smartAlerts.eum.form.slownessSimpleBelowOperatorText', { aggregationText });
}

function getSlownessGreaterOrLessOperatorText(
  aggregationText: string,
  operator: ThresholdOperator,
  thresholdValue: number
) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.eum.form.slownessGreaterOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.eum.form.slownessGreaterEqualsOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.eum.form.slownessLessOperatorText', {
        aggregationText,
        thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.eum.form.slownessLessEqualsOperatorText', {
        aggregationText,
        thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedOperator', { operator: operator }));
  }
}
