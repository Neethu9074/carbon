/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GlobalApplicationsSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { WebsiteSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { fixateTimeConfig, trimTimeConfigEnd } from 'in-stores/time/config';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { days, minutes } from 'in-services/time';
import { EventOrMap } from 'in-events/types';
import { TimeConfig } from 'in-types';

type AnySmartAlertConfig =
  | WebsiteSmartAlertConfig
  | MobileAppSmartAlertConfig
  | ApplicationSmartAlertConfig
  | GlobalApplicationsSmartAlertConfig
  | InfraSmartAlertConfig;

/**
 * Analyze queries such as GetCallGroups are limited to 1 month of data, and fail if a timeframe is requested that is too large.
 */
export const analyzeQueryTimeframeLimit = days.toMillis(31);

/**
 * Fixed buffer-delay to extend the timeframe in links in Smart Alerts, to reduce the likelihood that late data is not included in
 * the timeframe of the links to Unbound Analytics or the respective dashboards.
 * A secondary motivation is that the charts then include some historic context <b>before</b> the problem happens in the charts,
 * to better judge the severity of the problem (before vs. after). As a trade-off, we show more data that might be irrelevant
 * to the problem by default.
 */
export const dataDelayTimeframeExtension = minutes.toMillis(10);

export function getSmartAlertAnalyzeTimeConfig(event: EventOrMap, alertConfig: AnySmartAlertConfig) {
  const analyzeTimeConfig =
    alertConfig?.rule?.alertType === 'throughput'
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

/**
 * Extends the timeframe to the left by adjusting the window-size, for cases when a link needs to be created,
 * but we know that the event might refer to e timeframe slightly after the problem happened according to the persisted data,
 * due to the fact how late/long-running data is handled.
 *
 * @param timeConfig  The time-config to adjust.
 * @param granularity The metric granularity, to ensure the adjustment is not of size of a partial bucket.
 */
export function extendWindowSizeForLateData(timeConfig: TimeConfig, granularity: number): TimeConfig {
  // TODO The need for this function is only meant as a temporary workaround in AP Smart Alerts, to reduce the likelihood to link
  //      to a dashboard where the relevant data is not visible, due to the handling of late data in the backend, which the UI
  //      currently cannot be aware of. See the following for more context:
  //      - https://jsw.ibm.com/browse/INSTA-17414
  //      - https://instana.slack.com/archives/C072BPES4M6/p1728976692920249
  //      - https://instana.slack.com/archives/C025C5G7YP9/p1729016855118759
  return {
    ...timeConfig,
    // extend timeframe by a fixed delay, but at least 1 bucket size
    windowSize: timeConfig.windowSize + Math.max(granularity, dataDelayTimeframeExtension)
  };
}
