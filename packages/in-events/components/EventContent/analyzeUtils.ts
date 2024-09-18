/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GlobalApplicationsSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { TimeConfig, WebsiteAlertConfig, MobileAppAlertConfig } from 'in-types';
import { fixateTimeConfig, trimTimeConfigEnd } from 'in-stores/time/config';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { EventOrMap } from 'in-events/types';
import { days } from 'in-services/time';

type AnySmartAlertConfig =
  | WebsiteAlertConfig
  | MobileAppAlertConfig
  | ApplicationSmartAlertConfig
  | GlobalApplicationsSmartAlertConfig
  | InfraSmartAlertConfig;

/**
 * Analyze queries such as GetCallGroups are limited to 1 month of data, and fail if a timeframe is requested that is too large.
 */
export const analyzeQueryTimeframeLimit = days.toMillis(31);

export function getSmartAlertAnalyzeTimeConfig(event: EventOrMap, alertConfig: AnySmartAlertConfig) {
  const analyzeTimeConfig =
    alertConfig?.rule.alertType === 'throughput'
      ? getWidenedTimeConfigFromEvent(event, alertConfig.granularity)
      : getTimeConfigFromEvent(event);
  const fixedTimeConfig = fixateTimeConfig(analyzeTimeConfig);
  return trimTimeConfigEnd(fixedTimeConfig, analyzeQueryTimeframeLimit);
}

/**
 * Get the timeframe from an event and, if possible, widens the timeConfig on both sides, to return a bigger timeframe.
 * This can be useful when it is known that the surrounding area is actually from interest too.
 * @param event                The event to retrieve the timeframe from.
 * @param widenTimeframeMillis The time in millis to extend both sides. If to is NULL, then only the LHS is extended.
 */
function getWidenedTimeConfigFromEvent(event: EventOrMap, widenTimeframeMillis: number): TimeConfig {
  const timeConfig = getTimeConfigFromEvent(event);
  // extend begin by one bucket, and end also by bucket in case the to-timestamp is fixed
  const toIsFixed = timeConfig.to != null;
  const adjustedTo = toIsFixed ? timeConfig.to + widenTimeframeMillis : null;

  return {
    to: adjustedTo,
    focusedMoment: adjustedTo,
    windowSize: timeConfig.windowSize + (toIsFixed ? 2 : 1) * widenTimeframeMillis,
    autoRefresh: timeConfig.autoRefresh
  };
}
