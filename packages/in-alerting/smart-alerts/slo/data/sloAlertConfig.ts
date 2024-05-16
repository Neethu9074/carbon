/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import { deepCopy } from 'in-services/util/object';
import { minutes } from 'in-services/time/time';

export default function defaultSloAlertConfig(sloId?: string) {
  return Object.freeze({
    alertChannelIds: [],
    customPayloadFields: [],
    description: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder', {
      context: 'ERROR_BUDGET',
      percentage: 0
    }),
    name: t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
      context: 'ERROR_BUDGET',
      percentage: 0
    }),
    rule: {
      alertType: 'ERROR_BUDGET',
      metric: 'BURNED_PERCENTAGE'
    },
    severity: 5,
    sloIds: [sloId] ?? [],
    threshold: {
      lastUpdated: 0,
      type: 'staticThreshold',
      value: 0,
      operator: '>='
    },
    timeThreshold: {
      timeWindow: minutes.toMillis(10)
    },
    triggering: false
  } as ServiceLevelsAlertConfig);
}

export function createNewAlertConfig(sloId?: string): ServiceLevelsAlertConfig {
  return deepCopy(defaultSloAlertConfig(sloId));
}
