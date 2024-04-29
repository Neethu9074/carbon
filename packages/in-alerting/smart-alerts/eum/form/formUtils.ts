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
