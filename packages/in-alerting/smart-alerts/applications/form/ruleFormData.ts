/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ruleStatusCodeValueApplicationOptions as ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import { operators } from 'in-analyze/applicationFilter';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

export const ruleLogLevelOptions: ReadonlyArray<Option> = Object.freeze([
  { value: 'ERROR', label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogLevelOptions.error') },
  { value: 'WARN', label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogLevelOptions.warning') },
  { value: 'ANY', label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogLevelOptions.any') }
]);

export const ruleLogMessageOperatorOptions: ReadonlyArray<Option> = Object.freeze([
  {
    value: operators.NOT_EMPTY,
    label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogMessageOperationOptions.notEmpty')
  },
  {
    value: operators.EQUALS,
    label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogMessageOperationOptions.equals')
  },
  {
    value: operators.CONTAINS,
    label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogMessageOperationOptions.contains')
  },
  {
    value: operators.STARTS_WITH,
    label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogMessageOperationOptions.startsWith')
  },
  {
    value: operators.ENDS_WITH,
    label: t('in-alerting:smartAlerts.applications.ruleForm.ruleLogMessageOperationOptions.endsWith')
  }
]);

export function getLogMessageRuleOperatorLabel(value: string): string {
  return ruleLogMessageOperatorOptions.filter(entry => entry.value === value)[0].label;
}

export function getLogLevelRuleOperatorLabel(value: string): string {
  return ruleLogLevelOptions.filter(entry => entry.value === value)[0].label;
}

export const ruleMetricNameOptions = Object.freeze({
  statusCode: [
    {
      value: 'calls',
      label: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionStatusCodeCount')
    },
    {
      value: 'callRate',
      label: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionStatusCodeRate')
    }
  ],
  errors: [
    {
      value: 'errors',
      label: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionErrorRate')
    },
    {
      value: 'erroneousCalls',
      label: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionErrorCount')
    }
  ]
});

export function getStatusCodeLabel(value: string): string {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0]?.label ?? value.toString();
}
