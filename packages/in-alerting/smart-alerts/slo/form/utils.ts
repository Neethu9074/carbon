/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfig, ServiceLevelsAlertRuleUnion } from '@instana/types';

import { SloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';

export function formToSloAlertConfiguration(form: SloAlertForm): ServiceLevelsAlertConfig {
  const alertChannelIds = form.getIn(['alertChannelIds']).value;
  const customPayloadFields = form.getIn(['customPayloadFields']).toJS();
  const description = form.getIn(['description']).value;
  const name = form.getIn(['name']).value;
  const rule = form.getIn(['rule']).toJS() as ServiceLevelsAlertRuleUnion;
  const severity = form.getIn(['severity']).value;
  const sloIds = form.getIn(['sloIds']).value;
  const threshold = form.getIn(['threshold']).value ?? 0;
  const timeThreshold = form.getIn(['timeThreshold']).toJS();
  const triggering = form.getIn(['triggering']).value;
  const operator = form.getIn(['operator']).value;

  return {
    alertChannelIds,
    customPayloadFields,
    description,
    name,
    rule,
    severity,
    sloIds,
    threshold: {
      type: 'staticThreshold',
      value: threshold,
      operator,
      lastUpdated: Date.now()
    },
    timeThreshold,
    triggering
  };
}
