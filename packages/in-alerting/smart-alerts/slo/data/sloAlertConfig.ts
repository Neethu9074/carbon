/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfig, ThresholdOperator } from '@instana/types';

import { deepCopy } from 'in-services/util/object';
import { minutes } from 'in-services/time/time';
import { t } from 'in-i18n';

export const defaultOperator: ThresholdOperator = '>=';

export const defaultSloAlertConfig = Object.freeze({
  alertChannelIds: [],
  burnRateTimeWindows: {
    longTimeWindow: {
      duration: 0,
      durationType: 'minute'
    },
    shortTimeWindow: {
      duration: 0,
      durationType: 'minute'
    }
  },
  customPayloadFields: [],
  description: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder', {
    context: 'BURNED_PERCENTAGE',
    percentage: 0,
    operator: defaultOperator
  }),
  name: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
    context: 'BURNED_PERCENTAGE',
    percentage: 0,
    operator: defaultOperator
  }),
  rule: {
    alertType: 'ERROR_BUDGET',
    metric: 'BURNED_PERCENTAGE'
  },
  severity: 5,
  sloIds: [],
  threshold: {
    lastUpdated: 0,
    type: 'staticThreshold',
    value: 0,
    operator: defaultOperator
  },
  timeThreshold: {
    expiry: minutes.toMillis(10),
    timeWindow: minutes.toMillis(10)
  },
  triggering: false
} as ServiceLevelsAlertConfig);

export function createNewAlertConfig(sloId?: string): ServiceLevelsAlertConfig {
  const sloAlertConfig = deepCopy(defaultSloAlertConfig);
  if (sloId) {
    return { ...sloAlertConfig, sloIds: [sloId] };
  }
  return sloAlertConfig;
}
