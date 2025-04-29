/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { ThresholdOperator } from 'in-types';
import { t } from 'in-i18n';

export function getStaticThresholdHigherOrLowerOperatorText(
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

export function getThresholdHigherOrLowerOperatorText(metricLabel: string, operator: ThresholdOperator) {
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

export function getThroughputSimpleHighOrLowOperatorText(metricLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.throughputSimpleHighOperatorText', { metricLabel })
    : t('in-alerting:smartAlerts.eum.form.throughputSimpleLowOperatorText', { metricLabel });
}

export function getStatusCodeSimpleAboveOrBelowOperatorText(statusCodeLabel: string, operator: ThresholdOperator) {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.statusCodeSimpleAboveOperatorText', { statusCodeLabel })
    : t('in-alerting:smartAlerts.eum.form.statusCodeSimpleBelowOperatorText', {
        statusCodeLabel
      });
}

export function getSlownessSimpleHighOrLowOperatorText(
  metricLabel: string,
  aggregationText: string,
  operator: ThresholdOperator
): string {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.slownessSimpleHighOperatorTextWithMetric', { metricLabel, aggregationText })
    : t('in-alerting:smartAlerts.eum.form.slownessSimpleLowOperatorTextWithMetric', { metricLabel, aggregationText });
}

export function getSlownessSimpleAboveOrBelowOperatorText(
  metricLabel: string,
  aggregationText: string,
  operator: ThresholdOperator
): string {
  return isGreaterOperator(operator)
    ? t('in-alerting:smartAlerts.eum.form.slownessSimpleAboveOperatorTextWithMetric', { metricLabel, aggregationText })
    : t('in-alerting:smartAlerts.eum.form.slownessSimpleBelowOperatorTextWithMetric', { metricLabel, aggregationText });
}

export function getSlownessGreaterOrLessOperatorText(
  metricLabel: string,
  aggregationText: string,
  operator: ThresholdOperator,
  thresholdValue: number
): string {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.eum.form.slownessGreaterOperatorTextWithMetric', {
        metricLabel,
        aggregationText,
        thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.eum.form.slownessGreaterEqualsOperatorTextWithMetric', {
        metricLabel,
        aggregationText,
        thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.eum.form.slownessLessOperatorTextWithMetric', {
        metricLabel,
        aggregationText,
        thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.eum.form.slownessLessEqualsOperatorTextWithMetric', {
        metricLabel,
        aggregationText,
        thresholdValue
      });
    default:
      throw Error(t('in-alerting:smartAlerts.eum.form.unsupportedOperator', { operator: operator }));
  }
}
