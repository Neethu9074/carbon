/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export function getDefaultRules(useBaseline: boolean, defaultRule: any) {
  return [
    {
      rule: defaultRule,
      thresholdOperator: '>=',
      thresholds: {
        WARNING: {
          type: useBaseline ? HISTORIC_BASELINE : STATIC_THRESHOLD,
          seasonality: useBaseline ? DAILY : undefined,
          isCheckboxSelected: true,
          deviationFactor: defaultDeviationFactor,
          value: 0.0
        },
        CRITICAL: {
          type: useBaseline ? HISTORIC_BASELINE : STATIC_THRESHOLD,
          seasonality: useBaseline ? DAILY : undefined,
          isCheckboxSelected: false,
          deviationFactor: defaultDeviationFactor,
          value: 0.0
        }
      }
    }
  ];
}

export function getThresholdDescription(threshold: string): string | null {
  if (threshold === STATIC_THRESHOLD) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.static');
  } else if (threshold === DAILY) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.staticDaily');
  } else if (threshold === WEEKLY) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.staticWeekly');
  }
  return null;
}
