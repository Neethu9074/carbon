/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { assign, merge } from 'lodash';

import { WIGGLE_ROOM, ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { MetricsConfiguration } from 'in-components/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import { seconds, minutes, hours } from 'in-services/time';
import { Mutable, TimeConfig } from 'in-types';

const EXTEND_TIME_WINDOW_CUTOFF = 24 * 3600 * 1000;

interface TimeResult {
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

function isBlockSizeLessThanMinute(roundedBlockSize: number): boolean {
  return roundedBlockSize < 1;
}

function isBlockSizeGreaterThanOrEqualHour(roundedBlockSize: number): boolean {
  return roundedBlockSize >= 60;
}

function roundMillisToSeconds(blockSizeMillis: number): number {
  return Math.round(blockSizeMillis / 1000);
}

function roundMillisToMinutes(blockSizeMillis: number): number {
  return Math.round(blockSizeMillis / (1000 * 60));
}

function roundMillisToHours(blockSizeMillis: number): number {
  return Math.round(blockSizeMillis / (1000 * 60 * 60));
}

export function getSparkChartGranularity(timeConfig: TimeConfig): number {
  const blockSizeMillis = getBlockSizeMillis({
    windowSize: timeConfig.windowSize,
    minPixelsPerBlock: 25,
    width: 300
  });

  let roundedBlockSize = roundMillisToMinutes(blockSizeMillis);
  // If the roundedBlockSize is less than 1minute round to seconds instead.
  if (isBlockSizeLessThanMinute(roundedBlockSize)) {
    roundedBlockSize = roundMillisToSeconds(blockSizeMillis);

    return seconds.toMillis(roundedBlockSize);
  }

  // If the roundedBlockSize is greater than or equal 60min round to hours instead.
  if (isBlockSizeGreaterThanOrEqualHour(roundedBlockSize)) {
    roundedBlockSize = roundMillisToHours(blockSizeMillis);

    return hours.toMillis(roundedBlockSize);
  }

  return minutes.toMillis(roundedBlockSize);
}

export function extendMetricConfigurationOnLiveMode(metricsConfiguration: MetricsConfiguration) {
  const timeConfig = metricsConfiguration.filter.timeConfig;
  if (!timeConfig?.autoRefresh) {
    return metricsConfiguration;
  }

  return merge({}, metricsConfiguration, {
    filter: { timeConfig: extendWindowSizeOnLiveMode(timeConfig) }
  });
}

export function extendWindowSizeOnLiveMode(timeConfig: TimeConfig): TimeConfig {
  if (!timeConfig.autoRefresh) {
    return timeConfig;
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
