/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { assign, merge } from 'lodash';

import { WIGGLE_ROOM, ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { getChartGranularity } from 'in-stores/metric/metric';

const EXTEND_TIME_WINDOW_CUTOFF = 24 * 3600 * 1000;

/*
 * Returns a normalized timeConfig where "to" is set to result.time (unless it is already set and equal to result.time,
 * in which case timeConfig is returned unmodified). Instead of a result object with an attribute "time" you can also
 * pass in a number (millis since epoch) directly.
 */
export function getResolvedTimeConfig(timeConfig, resultOrTime) {
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

export function getSparkChartGranularity(timeConfig) {
  return getBlockSizeMillis({
    windowSize: timeConfig.windowSize,
    minPixelsPerBlock: 25,
    width: 300
  });
}

export function extendMetricConfigurationOnLiveMode(metricsConfiguration) {
  const timeConfig = metricsConfiguration.filter.timeConfig;
  if (!timeConfig.autoRefresh) {
    return metricsConfiguration;
  }

  return merge({}, metricsConfiguration, {
    filter: { timeConfig: extendWindowSizeOnLiveMode(metricsConfiguration.filter.timeConfig) }
  });
}

export function extendWindowSizeOnLiveMode(timeConfig) {
  if (!timeConfig.autoRefresh) {
    return timeConfig;
  }

  const granularity = getChartGranularity(timeConfig);
  const modifiedTimeConfig = assign({}, timeConfig);
  const animationDuration = timeConfig.autoRefresh ? ANIMATION_DURATION : 0;
  // No need to extend large time window because the impact of animationDuration and WIGGLE_ROOM will not be visible.
  // Extending a 7 days time window could also result in querying historic data
  if (modifiedTimeConfig.windowSize <= EXTEND_TIME_WINDOW_CUTOFF) {
    modifiedTimeConfig.windowSize =
      modifiedTimeConfig.windowSize + WIGGLE_ROOM + 2 * Math.max(animationDuration, granularity);
  }

  return modifiedTimeConfig;
}
