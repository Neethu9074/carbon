/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AdjustedTimeframe, DurationUnitType, TimeConfig } from '@instana/types';

import { days, hours, minutes } from 'in-services/time/time';

export function applyAdjustedTimeframe(timeConfig: TimeConfig, adjustedTimeframe?: AdjustedTimeframe): TimeConfig {
  return {
    ...timeConfig,
    ...(adjustedTimeframe ?? {}),
    focusedMoment: timeConfig.focusedMoment ?? adjustedTimeframe?.to
  };
}

export function calculateSloGranularity(timeConfig: TimeConfig): number {
  const now = Date.now();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;
  const oneDay = days.toMillis(1);

  if (timeConfig.windowSize < oneDay && from > now - oneDay) {
    // if timeframe is within the last 24 hours, and window-size less than a day, then request metric in
    // one minute granularity. We do not want to query CH with oneMinute granularity with large windowSize as
    // this would lead to performance problems.
    return minutes.toMillis(1);
  }
  return hours.toMillis(1);
}

export function calculateTimeRemaining(timeConfig: TimeConfig): number {
  const now = Date.now();
  const to = timeConfig.to ?? now;
  return to - now;
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
