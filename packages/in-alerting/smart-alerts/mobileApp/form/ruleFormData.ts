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
  ]
});

export function getStatusCodeLabel(value: string): string {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0].label;
}
