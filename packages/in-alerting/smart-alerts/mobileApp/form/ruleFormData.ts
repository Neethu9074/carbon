/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import { t } from 'in-i18n';

export const ruleMetricNameOptions = Object.freeze({
  statusCode: [
    { value: 'httpxxx', label: t('in-alerting:smartAlerts.mobileApp.form.ruleMetricNameOptionStatusCodeHttpxxx') },
    {
      value: 'beaconRate',
      label: t('in-alerting:smartAlerts.mobileApp.form.ruleMetricNameOptionBeaconRate')
    }
  ],
  throughput: [
    { value: 'sessions', label: t('in-alerting:smartAlerts.mobileApp.form.ruleMetricNameOptionThroughputSessions') },
    {
      value: 'views',
      label: t('in-alerting:smartAlerts.mobileApp.form.ruleMetricNameOptionThroughputViews')
    }
  ],
  crash: [
    { value: 'crashAffectedSessionRate', label: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedSessionRate') },
    { value: 'crashFreeSessionRate', label: t('in-alerting:smartAlerts.mobileApp.data.crashFreeSessionRate') },
    {
      value: 'crashAffectedSessionCount',
      label: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedSessionCount')
    },
    { value: 'crashFreeSessionCount', label: t('in-alerting:smartAlerts.mobileApp.data.crashFreeSessionCount') },
    { value: 'crashFreeUserRate', label: t('in-alerting:smartAlerts.mobileApp.data.crashFreeUserRate') },
    { value: 'crashAffectedUserRate', label: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedUserRate') },
    { value: 'crashAffectedUserCount', label: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedUserCount') },
    { value: 'crashFreeUserCount', label: t('in-alerting:smartAlerts.mobileApp.data.crashFreeUserCount') }
  ],
  customEvent: [
    { value: 'beaconCount', label: t('in-alerting:smartAlerts.eum.data.customOccurrences') },
    { value: 'customDuration', label: t('in-alerting:smartAlerts.eum.data.customDuration') },
    { value: 'customMetric', label: t('in-alerting:smartAlerts.eum.data.customMetric') }
  ]
});

export function getStatusCodeLabel(value: string): string {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0].label;
}
