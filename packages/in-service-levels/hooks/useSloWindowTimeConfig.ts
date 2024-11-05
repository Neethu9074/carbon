/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isBefore } from 'date-fns';
import { useMemo } from 'react';

import { isFixedTimeWindow, isRollingTimeWindow, TimeConfig, TimeWindow } from '@instana/types';

import { getAddForTimeWindowUnit, getSubForTimeWindowUnit, toFixedTimeConfig } from 'in-service-levels/utils/time';
import useTimeConfig from 'in-hooks/useTimeConfig';

/**
 * Calculates and adjusted timeConfig that represents the full SLO time window in effect at the end of the current time context.
 * @param timeWindow The Slo timeWindow to calculate a timeConfig for.
 *
 * Note on preview usage:
 * In comparison to the SloWidget this does not have an explicit toggle for the preview mode.
 * Instead, the 7 day preview mode can simply be established by:
 * Providing a custom timeConfig context that is open (last X / no 'to' timestamp) and <= 7 days
 * Providing a timeWindow of 1 week
 */
export default function useSloWindowTimeConfig(timeWindow: TimeWindow): TimeConfig {
  const timeConfig = useTimeConfig();

  return useMemo(() => calculateTimeConfigForSloTimeWindow(timeConfig, timeWindow), [timeConfig, timeWindow]);
}

export function calculateTimeConfigForSloTimeWindow(timeConfig: TimeConfig, timeWindow: TimeWindow): TimeConfig {
  const { duration, durationUnit } = timeWindow;
  let toTimestamp = timeConfig.to ?? Date.now();
  let fromTimestamp = toTimestamp - timeConfig.windowSize;

  if (isFixedTimeWindow(timeWindow)) {
    if (timeWindow.startTimestamp) {
      const addition = getAddForTimeWindowUnit(durationUnit);
      let nextStart = new Date(timeWindow.startTimestamp);
      let latestIntervalStart: Date;

      do {
        latestIntervalStart = nextStart;
        nextStart = addition(latestIntervalStart, duration);
      } while (isBefore(nextStart, toTimestamp));

      fromTimestamp = latestIntervalStart.getTime();
      toTimestamp = nextStart.getTime();
      return toFixedTimeConfig(fromTimestamp, toTimestamp);
    }
  }

  if (isRollingTimeWindow(timeWindow)) {
    const subtraction = getSubForTimeWindowUnit(durationUnit);
    fromTimestamp = subtraction(new Date(toTimestamp), duration).getTime();
    return toFixedTimeConfig(fromTimestamp, toTimestamp);
  }

  return timeConfig;
}
