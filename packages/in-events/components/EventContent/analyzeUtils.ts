/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  TimeConfig,
  WebsiteAlertConfig,
  ApplicationAlertConfig,
  GlobalApplicationsAlertConfig,
  InfraAlertConfig
} from 'in-types';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { fixateTimeConfig } from 'in-stores/time/config';
import { EventOrMap } from 'in-events/types';

type AnySmartAlertConfig =
  | WebsiteAlertConfig
  | ApplicationAlertConfig
  | GlobalApplicationsAlertConfig
  | InfraAlertConfig;

export function getSmartAlertAnalyzeTimeConfig(event: EventOrMap, alertConfig: AnySmartAlertConfig) {
  const analyzeTimeConfig =
    alertConfig.rule.alertType === 'throughput'
      ? getWidenedTimeConfigFromEvent(event, alertConfig.granularity)
      : getTimeConfigFromEvent(event);
  return fixateTimeConfig(analyzeTimeConfig);
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
