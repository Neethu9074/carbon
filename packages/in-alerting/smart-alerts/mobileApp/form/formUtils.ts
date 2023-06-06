/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';

import {
  CustomEventMobileAppAlertRule,
  MobileAppAlertRule,
  StatusCodeMobileAppAlertRule,
  ThroughputMobileAppAlertRule
} from '@instana/types';

import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { onLoadTime, beaconRate } from 'in-alerting/smart-alerts/mobileApp/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdOperator, ThresholdType } from 'in-types';
import { t } from 'in-i18n';

export function getTitlePlaceholder(form: MapForm<any>) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as MobileAppAlertRule;
  const alertType = rule.alertType;

  switch (alertType) {
    case 'statusCode': {
      const statusCodeString = (rule as StatusCodeMobileAppAlertRule).value;
      return t('in-alerting:smartAlerts.eum.form.HTTPStatusCodes', {
        statusCode: fillStatusCodeValue(statusCodeString)
      });
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig!.getMetricName(rule as MobileAppAlertRule);
      const thresholdOperator = ((form.get('threshold') as MapForm<any>).get('operator') as Field<ThresholdOperator>)
        .value;
      return getThroughputSimpleHighOrLowOperatorText(
        blueprintConfig!.getMetricLabel(metricName as MetricName),
        thresholdOperator
      );
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventMobileAppAlertRule).customEventName;
      return t('in-alerting:smartAlerts.eum.form.customEvents', { customEventName });
    }
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedAlertType', { alertType: alertType }));
  }
}

export function getDescriptionPlaceholder(form: MapForm<any>) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as MobileAppAlertRule;
  const alertType = rule.alertType;
  const thresholdForm = form.get('threshold') as MapForm<any>;

  const thresholdOperator = (thresholdForm.get('operator') as Field<ThresholdOperator>).value;

  switch (alertType) {
    case 'statusCode': {
      const statusCodeRule = rule as StatusCodeMobileAppAlertRule;
      const statusCodeString = statusCodeRule.value;
      return getStatusCodeSimpleAboveOrBelowOperatorText(getStatusCodeLabel(statusCodeString), thresholdOperator);
    }
    case 'throughput': {
      const blueprintConfig = getBlueprintConfig(alertType);
      const metricName = blueprintConfig!.getMetricName(rule as ThroughputMobileAppAlertRule);
      const metricLabel = blueprintConfig!.getMetricLabel(metricName as MetricName);
      const thresholdType = (thresholdForm.get('type') as Field<ThresholdType>).value;

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = (thresholdForm.get('value') as Field<number>).value;
        return getStaticThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator, thresholdValue);
      }
      return getThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator);
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventMobileAppAlertRule).customEventName;

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
    case beaconRate:
      return '%';
    default:
      return '';
  }
}

export function isPercentageMetric(metricName: string) {
  return metricName === beaconRate;
}

function fillStatusCodeValue(statusCode: string) {
  if (statusCode.length === 1) {
    return `${statusCode}XX`;
  } else if (statusCode.length === 2) {
    return `${statusCode}X`;
  }
  return statusCode;
}

function getThroughputSimpleHighOrLowOperatorText(metricLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.throughputSimpleHighOperatorText', { metricLabel })
    : t('in-alerting:smartAlerts.eum.form.throughputSimpleLowOperatorText', { metricLabel });
}

function getStatusCodeSimpleAboveOrBelowOperatorText(statusCodeLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.statusCodeSimpleAboveOperatorText', { statusCodeLabel })
    : t('in-alerting:smartAlerts.eum.form.statusCodeSimpleBelowOperatorText', {
        statusCodeLabel
      });
}

function getStaticThresholdHigherOrLowerOperatorText(
  metricLabel: string,
  operator: ThresholdOperator,
  thresholdValue: string | number
) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.eum.form.staticThresholdHigherOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.eum.form.staticThresholdHigherEqualsOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.eum.form.staticThresholdLowerOperatorText', {
        metricLabel,
        thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.eum.form.staticThresholdLowerEqualsOperatorText', {
        metricLabel,
        thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedOperator', { operator }));
  }
}

function getThresholdHigherOrLowerOperatorText(metricLabel: string, operator: ThresholdOperator) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.eum.form.thresholdHigherOperatorText', { metricLabel });
    case '>=':
      return t('in-alerting:smartAlerts.eum.form.thresholdHigherEqualsOperatorText', { metricLabel });
    case '<':
      return t('in-alerting:smartAlerts.eum.form.thresholdLowerOperatorText', { metricLabel });
    case '<=':
      return t('in-alerting:smartAlerts.eum.form.thresholdLowerEqualsOperatorText', { metricLabel });
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedOperator', { operator }));
  }
}
