/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';

import {
  AdjustedTimeframe,
  DurationUnitType,
  isFixedTimeWindow,
  isRollingTimeWindow,
  TimeConfig,
  TimeWindow
} from '@instana/types';

import { ServiceLevelErrors } from 'in-service-levels/constants';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { days, hours, minutes } from 'in-services/time/time';
import { MetricDataSeries } from 'in-components/Chart/types';

/**
 * Returns the index of the first time-window that contains a data-point,
 * and -1 if none of the metrics data-points fit into any of the time-windows.
 **/
export function getIndexOfFirstTimeWindowWithData(metrics: MetricDataSeries[], timeWindows: TimeConfig[]): number {
  const flatMetrics = metrics.flat();
  const dateNow = Date.now();

  // Because throwIfClosureRequired is enabled Babel throws an error and won't
  // allow usage of let or const without defining a new blockscope. Falling
  // back to var, since var does not have a blockscope and works as intented in
  // this context.
  for (var datapoint of flatMetrics) {
    var [metricTimestamp] = datapoint;
    var timeWindowIndex = timeWindows.findIndex(timeWindow => {
      const timeWindowTo = timeWindow.to ?? dateNow;
      const timeWindowStartTime = timeWindowTo - timeWindow.windowSize;
      return metricTimestamp >= timeWindowStartTime && metricTimestamp < timeWindowTo;
    });

    if (timeWindowIndex >= 0) return timeWindowIndex;
  }

  return -1;
}

export function applyAdjustedTimeframe(timeConfig: TimeConfig, adjustedTimeframe?: AdjustedTimeframe): TimeConfig {
  return {
    ...timeConfig,
    ...(adjustedTimeframe ?? {}),
    focusedMoment: timeConfig.focusedMoment ?? adjustedTimeframe?.to
  };
}

export function calculateSloGranularity(timeConfig: TimeConfig, minGranularity = minutes.toMillis(1)): number {
  const now = new Date().getTime();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;
  const oneDay = days.toMillis(1);

  if (timeConfig.windowSize < oneDay && from > now - oneDay) {
    // if timeframe is within the last 24 hours, and window-size less than a day, then request metric in
    // one minute granularity. We do not want to query CH with oneMinute granularity with large windowSize as
    // this would lead to performance problems.
    return minGranularity;
  }
  return hours.toMillis(1);
}

export function calculateTimeRemaining(
  sloTimeConfig: TimeConfig,
  selectedTimeConfig: TimeConfig,
  timeWindowType: TimeWindow['type'],
  timeWindows?: TimeConfig[]
) {
  if (timeWindowType === 'rolling') return calculateTimeRemainingFromNow(sloTimeConfig);

  // In case the there is no valid result from backend we return 0
  if (!timeWindows || timeWindows.length < 1) return 0;

  // Calculate remaining time for fixed time windows
  return calculateTimeRemainingFromWithinTimeWindow(selectedTimeConfig, timeWindows[0]);
}

// exported for testing purposes
export function calculateTimeRemainingFromNow(timeConfig: TimeConfig): number {
  const now = new Date().getTime();
  const to = timeConfig.to ?? now;
  return to - now;
}

// exported for testing purposes
export function calculateTimeRemainingFromWithinTimeWindow(timeConfig: TimeConfig, timeWindow: TimeConfig): number {
  const now = new Date().getTime();
  const selectedTo = timeConfig.to ?? now;

  const windowTo = timeWindow.to ?? now;
  return windowTo - selectedTo;
}

export function getEntireTimeWindowConfigFromTimeWindows(timeWindows: TimeConfig[]): TimeConfig {
  const now = new Date().getTime();
  const timeWindowEnd = timeWindows.reduce(
    (prevTo, currTw) => (prevTo > (currTw.to ?? now) ? prevTo : currTw.to ?? now),
    0
  );
  const timeWindowStart = timeWindows.reduce((prevFrom, currTw) => {
    const currFrom = (currTw.to ?? timeWindowEnd) - currTw.windowSize;
    return prevFrom < currFrom ? prevFrom : currFrom;
  }, timeWindowEnd);

  const to = timeWindowEnd;
  const windowSize = timeWindowEnd - timeWindowStart;
  return {
    to,
    windowSize,
    focusedMoment: to,
    autoRefresh: false
  };
}

export function getSubForTimeWindowUnit(durationUnit: DurationUnitType) {
  switch (durationUnit) {
    case 'month':
      return subMonths;
    case 'week':
      return subWeeks;
    case 'day':
    default:
      return subDays;
  }
}

export function getAddForTimeWindowUnit(durationUnit: DurationUnitType) {
  switch (durationUnit) {
    case 'month':
      return addMonths;
    case 'week':
      return addWeeks;
    case 'day':
    default:
      return addDays;
  }
}

export function toFixedTimeConfig(from: number, to: number): TimeConfig {
  return {
    windowSize: to - from,
    to,
    focusedMoment: to,
    autoRefresh: false
  };
}

function calculateWindowSize(timeWindow: TimeWindow): number {
  const now = Date.now();
  const addition = getAddForTimeWindowUnit(timeWindow.durationUnit);
  const futureDate = addition(now, timeWindow.duration);
  return futureDate.getTime() - now;
}

export function calculateTimeConfigFromTimeWindow(timeWindow: TimeWindow, timeConfig?: TimeConfig): TimeConfig {
  const now = Date.now();
  const baseTimeConfig = timeConfig ?? getTimeConfigAtMoment(now);
  const windowSize = calculateWindowSize(timeWindow);

  if (isFixedTimeWindow(timeWindow)) {
    const timeWindowCount = Math.floor((now - timeWindow.startTimestamp) / windowSize);
    const currentTimeWindowStart = timeWindow.startTimestamp + windowSize * timeWindowCount;

    return {
      ...baseTimeConfig,
      windowSize,
      to: currentTimeWindowStart
    };
  }

  if (isRollingTimeWindow(timeWindow)) {
    return {
      ...baseTimeConfig,
      windowSize,
      to: now - windowSize
    };
  }

  throw new Error(ServiceLevelErrors.UNSUPPORTED_TIME_WINDOW_TYPE);
}

export function getMaxTimeWindowDurationValue(unit: DurationUnitType): number {
  switch (unit) {
    case 'day':
      return 31;
    case 'week':
      return 4;
    case 'month':
    default:
      return 12;
  }
}

export function adjustTimeWindowsToTimeConfig(timeConfig: TimeConfig, timeWindows: TimeConfig[]): TimeConfig[] {
  const now = new Date().getTime();
  const timeConfigStart = (timeConfig.to ?? now) - timeConfig.windowSize;
  const timeConfigEnd = timeConfig.to ?? now;

  return timeWindows.map(timeWindow => {
    const timeWindowStart = (timeWindow.to ?? now) - timeWindow.windowSize;
    const timeWindowEnd = timeWindow.to ?? now;

    const adjustedStart = timeWindowStart < timeConfigStart ? timeConfigStart : timeWindowStart;
    const adjustedEnd = timeWindowEnd > timeConfigEnd ? timeConfigEnd : timeWindowEnd;

    return {
      ...timeWindow,
      to: adjustedEnd,
      windowSize: adjustedEnd - adjustedStart
    };
  });
}
