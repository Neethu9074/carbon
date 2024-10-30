/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AdjustedTimeframe,
  DurationUnitType,
  isFixedTimeWindow,
  isRollingTimeWindow,
  TimeConfig,
  TimeWindow
} from '@instana/types';
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { ServiceLevelErrors } from 'in-service-levels/constants';

import { days, hours, minutes } from 'in-services/time/time';
import { getTimeConfigAtMoment } from 'in-stores/time/config';

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

export function calculateEventGraphGranularity(timeConfig: TimeConfig) {
  const oneHour = hours.toMillis(1);
  const sixHours = hours.toMillis(6);
  const oneDay = days.toMillis(1);
  const twoDays = days.toMillis(2);
  const oneWeek = days.toMillis(7);

  if (timeConfig.windowSize <= oneHour) {
    return minutes.toMillis(1);
  }

  if (timeConfig.windowSize <= sixHours) {
    return minutes.toMillis(5);
  }

  if (timeConfig.windowSize < oneDay) {
    return minutes.toMillis(10);
  }

  if (timeConfig.windowSize <= twoDays) {
    return hours.toMillis(1);
  }

  if (timeConfig.windowSize <= oneWeek) {
    return hours.toMillis(2);
  }

  return days.toMillis(1);
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

export function calculateWindowSize(timeWindow: TimeWindow): number {
  const now = Date.now();
  const addition = getAddForTimeWindowUnit(timeWindow.durationUnit);
  const futureDate = addition(now, timeWindow.duration);
  return futureDate.getTime() - now;
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
