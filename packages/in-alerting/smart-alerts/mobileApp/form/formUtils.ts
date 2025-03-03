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

import {
  getStaticThresholdHigherOrLowerOperatorText,
  getStatusCodeSimpleAboveOrBelowOperatorText,
  getThresholdHigherOrLowerOperatorText,
  getThroughputSimpleHighOrLowOperatorText
} from 'in-alerting/smart-alerts/eum/form/formUtils';
import {
  getBlueprintConfig,
  MetricName,
  rateMetricsForCrashBlueprint
} from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { severityMap, WARNING_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { isEmpty as checkIsEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { onLoadTime, beaconRate } from 'in-alerting/smart-alerts/mobileApp/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdOperator } from 'in-types';
import { t } from 'in-i18n';

export function getTitlePlaceholder(form: MapForm<any>) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as MobileAppAlertRule;
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.getMetricName(rule as MobileAppAlertRule);
  const thresholdOperator = ((form.get('threshold') as MapForm<any>).get('operator') as Field<ThresholdOperator>).value;

  switch (alertType) {
    case 'statusCode': {
      const statusCodeString = (rule as StatusCodeMobileAppAlertRule).value;
      return t('in-alerting:smartAlerts.eum.form.HTTPStatusCodes', {
        statusCode: fillStatusCodeValue(statusCodeString)
      });
    }
    case 'throughput': {
      return getThroughputSimpleHighOrLowOperatorText(
        blueprintConfig.getMetricLabel(metricName as MetricName),
        thresholdOperator
      );
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventMobileAppAlertRule).customEventName;
      return t('in-alerting:smartAlerts.eum.form.customEvents', { customEventName });
    }
    case 'crash': {
      return getTitlePlaceholderForCrash(blueprintConfig.getMetricLabel(metricName as MetricName), thresholdOperator);
    }
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedAlertType', { alertType: alertType }));
  }
}

export function getDescriptionPlaceholder(form: MapForm<any>, severity?: number) {
  const rule = (form.get('rule') as MapForm<any>).toJS() as unknown as MobileAppAlertRule;
  const alertType = rule.alertType;
  const thresholdForm = form.get('threshold') as MapForm<any>;

  const thresholdOperator = (thresholdForm.get('operator') as Field<ThresholdOperator>).value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig!.getMetricName(rule as ThroughputMobileAppAlertRule);
  const metricLabel = blueprintConfig!.getMetricLabel(metricName as MetricName);

  switch (alertType) {
    case 'statusCode': {
      const statusCodeRule = rule as StatusCodeMobileAppAlertRule;
      const statusCodeString = statusCodeRule.value;
      return getStatusCodeSimpleAboveOrBelowOperatorText(getStatusCodeLabel(statusCodeString), thresholdOperator);
    }
    case 'throughput': {
      const thresholdType = thresholdForm.get('warningThreshold').get('type').value;

      const isMultiThresholdConfigured =
        !checkIsEmpty(thresholdForm?.get('warningThreshold')?.get('value')?.value) &&
        !checkIsEmpty(thresholdForm?.get('criticalThreshold')?.get('value')?.value);

      if (thresholdType === STATIC_THRESHOLD && !isMultiThresholdConfigured) {
        const thresholdValue = getThresholdValue(thresholdForm, severity);
        return getStaticThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator, thresholdValue);
      }
      return getThresholdHigherOrLowerOperatorText(metricLabel, thresholdOperator);
    }
    case 'customEvent': {
      const customEventName = (rule as CustomEventMobileAppAlertRule).customEventName;

      return t('in-alerting:smartAlerts.eum.form.customEventsText', { customEventName });
    }
    case 'crash': {
      return getDescriptionPlaceholderForCrash(metricLabel, thresholdOperator);
    }
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedAlertType', { alertType: alertType }));
  }
}

export function getThresholdValue(thresholdForm: MapForm<any>, severity?: number) {
  if (!severity) {
    return null;
  }
  return severityMap[severity] === WARNING_SEVERITY
    ? thresholdForm?.get('warningThreshold')?.get('value')?.value
    : thresholdForm?.get('criticalThreshold')?.get('value')?.value;
}

export function getMetricUnitPostfix(metricName: string) {
  if (metricName === onLoadTime) {
    return 'ms';
  }
  if (isPercentageMetric(metricName)) {
    return '%';
  }

  return '';
}

export function isPercentageMetric(metricName: string) {
  return metricName === beaconRate || rateMetricsForCrashBlueprint.has(metricName);
}

function fillStatusCodeValue(statusCode: string) {
  if (statusCode.length === 1) {
    return `${statusCode}XX`;
  } else if (statusCode.length === 2) {
    return `${statusCode}X`;
  }
  return statusCode;
}

function getTitlePlaceholderForCrash(metricLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.mobileApp.form.titlePlaceholderCrashSimpleHighOperator', { metricLabel })
    : t('in-alerting:smartAlerts.mobileApp.form.titlePlaceholderCrashSimpleLowOperator', { metricLabel });
}

function getDescriptionPlaceholderForCrash(metricLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.mobileApp.form.descriptionPlaceholderCrashSimpleAboveOperator', { metricLabel })
    : t('in-alerting:smartAlerts.mobileApp.form.descriptionPlaceholderCrashSimpleBelowOperator', {
        metricLabel
      });
}
