/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AdjustedTimeframe, DurationUnitType, TimeConfig, TimeWindow } from '@instana/types';

import { days, hours, minutes } from 'in-services/time/time';

export function applyAdjustedTimeframe(timeConfig: TimeConfig, adjustedTimeframe?: AdjustedTimeframe): TimeConfig {
  return {
    ...timeConfig,
    ...(adjustedTimeframe ?? {}),
    focusedMoment: timeConfig.focusedMoment ?? adjustedTimeframe?.to
  };
}

export function calculateTrafficGranularity(timeConfig: TimeConfig) {
  const oneDay = days.toMillis(1);
  const twoDays = days.toMillis(2);
  const oneHour = hours.toMillis(1);

  if (timeConfig.windowSize <= oneHour) {
    return minutes.toMillis(1);
  }

  if (timeConfig.windowSize <= oneDay) {
    return minutes.toMillis(5);
  }

  if (timeConfig.windowSize <= twoDays) {
    return minutes.toMillis(10);
  }

  return hours.toMillis(1);
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

export function calculateTimeRemainingFromNow(timeConfig: TimeConfig): number {
  const now = new Date().getTime();
  const to = timeConfig.to ?? now;
  return to - now;
}

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
