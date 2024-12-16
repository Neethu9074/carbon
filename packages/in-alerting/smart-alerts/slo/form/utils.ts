/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { hoursToMilliseconds, minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

import {
  DurationUnitType,
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertRuleUnion,
  ServiceLevelObjectiveConfiguration
} from '@instana/types';

import { SloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';

export const getSloWithMinDurationTimeWindow = (slos: ServiceLevelObjectiveConfiguration[]) => {
  if (slos.length === 0) return undefined;

  return slos.reduce((prevSlo, currentSlo) => {
    return calculateTimeWindowInMilliseconds(prevSlo.timeWindow.duration, prevSlo.timeWindow.durationUnit) <
      calculateTimeWindowInMilliseconds(currentSlo.timeWindow.duration, currentSlo.timeWindow.durationUnit)
      ? prevSlo
      : currentSlo;
  });
};

export const calculateTimeWindowInMilliseconds = (duration: number, durationUnit: DurationUnitType) => {
  if (durationUnit === 'millisecond') return duration;
  if (durationUnit === 'second') return secondsToMilliseconds(duration);
  if (durationUnit === 'minute') return minutesToMilliseconds(duration);
  if (durationUnit === 'hour') return hoursToMilliseconds(duration);
  if (durationUnit === 'day') return hoursToMilliseconds(duration) * 24;
  if (durationUnit === 'week') return hoursToMilliseconds(duration) * 24 * 7;
  if (durationUnit === 'month') return hoursToMilliseconds(duration) * 24 * 30;

  throw new Error('Unknown duration unit');
};

export function formToSloAlertConfiguration(form: SloAlertForm): ServiceLevelsAlertConfig {
  const alertMetricField = form.getIn(['rule', 'metric']);
  const alertChannelIds = form.getIn(['alertChannelIds']).value;
  const burnRateTimeWindows =
    alertMetricField.value === 'BURN_RATE' ? form.getIn(['burnRateTimeWindows']).toJS() : undefined;
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
    burnRateTimeWindows,
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
