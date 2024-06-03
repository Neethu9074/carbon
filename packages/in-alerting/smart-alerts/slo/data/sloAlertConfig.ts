/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfig, ThresholdOperator } from '@instana/types';
import { t } from '@instana/i18n-react';

import { getSloAlertOperatorContext } from 'in-alerting/smart-alerts/slo/components/OperatorDropdown';
import { deepCopy } from 'in-services/util/object';
import { minutes } from 'in-services/time/time';

const defaultOperator: ThresholdOperator = '>=';
const defaultOperatorContext = getSloAlertOperatorContext(defaultOperator);

export const defaultSloAlertConfig = Object.freeze({
  alertChannelIds: [],
  customPayloadFields: [],
  description: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder', {
    context: 'ERROR_BUDGET',
    percentage: 0,
    operator: defaultOperatorContext
  }),
  name: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
    context: 'ERROR_BUDGET',
    percentage: 0,
    operator: defaultOperatorContext
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
