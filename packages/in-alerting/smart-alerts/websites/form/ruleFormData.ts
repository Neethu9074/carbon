/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import { operators } from 'in-analyze/applicationFilter';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

export const ruleJsErrorsOperatorOptions: ReadonlyArray<Option> = Object.freeze([
  { value: operators.NOT_EMPTY, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionAny') },
  { value: operators.EQUALS, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionEquals') },
  { value: operators.CONTAINS, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionContains') },
  {
    value: operators.STARTS_WITH,
    label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionStartsWith')
  },
  { value: operators.ENDS_WITH, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionEndWith') }
]);

export const ruleMetricNameOptions = Object.freeze({
  specificJsError: [
    { value: 'errors', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSpecificJsErrorErrors') },
    {
      value: 'specificJsErrorRate',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSpecificJsErrorSpecificJsErrorRate')
    }
  ],
  statusCode: [
    { value: 'httpxxx', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionStatusCodeHttpxxx') },
    {
      value: 'specificStatusCodeRate',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionStatusCodeSpecificStatusCodeRate')
    }
  ],
  slowness: [
    { value: 'onLoadTime', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSlownessOnLoadTime') },
    { value: 'httpLatency', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSlownessHttpLatency') }
  ],
  throughput: [
    { value: 'pageLoads', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionThroughputPageLoads') },
    {
      value: 'pageTransitions',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionThroughputPageTransitions')
    }
  ]
});

export function getStatusCodeLabel(value: string): string {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0].label;
}

export function getRuleOperatorLabel(value: string): string {
  return ruleJsErrorsOperatorOptions.filter(entry => entry.value === value)[0].label;
}
