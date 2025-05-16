/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { assign, merge } from 'lodash';

import { WIGGLE_ROOM, ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { MetricsConfiguration } from 'in-components/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Mutable, Nullish, TimeConfig } from 'in-types';

const EXTEND_TIME_WINDOW_CUTOFF = 24 * 3600 * 1000;

export interface TimeResult {
  time: number;
}

/*
 * Returns a normalized timeConfig where "to" is set to result.time (unless it is already set and equal to result.time,
 * in which case timeConfig is returned unmodified). Instead of a result object with an attribute "time" you can also
 * pass in a number (millis since epoch) directly.
 */
export function getResolvedTimeConfig(timeConfig: TimeConfig, resultOrTime: number | TimeResult): TimeConfig {
  let resultTime;
  if (typeof resultOrTime === 'number') {
    resultTime = resultOrTime;
  } else if (typeof resultOrTime === 'object') {
    resultTime = resultOrTime.time;
  }

  if (timeConfig.to === resultTime) {
    return timeConfig;
  }
  return {
    ...timeConfig,
    to: resultTime,
    focusedMoment: resultTime
  };
}

/**
 * Focus on the call itself
 */
export function timeConfigFromCall(callTime: number, callDuration: number): TimeConfig {
  const to = callTime + Math.max(callDuration, 1);
  const from = callTime;
  return {
    to,
    windowSize: to - from,
    focusedMoment: to,
    autoRefresh: false
  };
}

export const getSparkChartGranularity = getChartGranularity;

export function extendMetricConfigurationOnLiveMode(metricsConfiguration: MetricsConfiguration): MetricsConfiguration {
  const timeConfig = metricsConfiguration.filter?.timeConfig;
  if (!timeConfig?.autoRefresh) {
    return metricsConfiguration;
  }

  return merge({}, metricsConfiguration, {
    filter: { timeConfig: extendWindowSizeOnLiveMode(timeConfig) }
  });
}

export function extendWindowSizeOnLiveMode(timeConfig: TimeConfig, disableLiveMode?: boolean): TimeConfig {
  if (!timeConfig.autoRefresh || disableLiveMode) {
    return {
      ...timeConfig,
      autoRefresh: false
    };
  }

  const granularity = getChartGranularity(timeConfig);
  const modifiedTimeConfig: Mutable<TimeConfig> = assign({}, timeConfig);
  const animationDuration = timeConfig.autoRefresh ? ANIMATION_DURATION : 0;
  // No need to extend large time window because the impact of animationDuration and WIGGLE_ROOM will not be visible.
  // Extending a 7 days time window could also result in querying historic data
  if (modifiedTimeConfig.windowSize <= EXTEND_TIME_WINDOW_CUTOFF) {
    modifiedTimeConfig.windowSize =
      modifiedTimeConfig.windowSize + WIGGLE_ROOM + 2 * Math.max(animationDuration, granularity);
  }

  return modifiedTimeConfig;
}

export function getValueFromSingleValueMetric(metric: number[][] | undefined) {
  return metric?.[0]?.[1];
}

export function formatMetricIfPresent(value: number | Nullish, formatter: (val: number) => string): string {
  return value != null ? formatter(value) : '-';
}
