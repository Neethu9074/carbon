/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { addDays, addMonths, addWeeks, isBefore, subDays, subMonths, subWeeks } from 'date-fns';
import { useMemo } from 'react';

import { TimeConfig } from '@instana/types';

import { parseTimestamp, TimeWindowDuration } from 'in-custom-dashboards/widgets/SloLegacy/form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time/time';

interface CalculateTimeWindowConfigProps {
  timeConfig: TimeConfig;
  isRolling?: boolean;
  isFixed?: boolean;
  timeWindowDuration: number;
  timeWindowDurationUnit: TimeWindowDuration;
  timeWindowStartDate?: string;
  timeWindowStartTime?: string;
}

export interface TimeWindowConfig {
  timeConfig: TimeConfig;
  fromTimestamp: number;
  toTimestamp: number;
}

function getAddForTimeWindowUnit(timeWindowDurationUnit: TimeWindowDuration) {
  switch (timeWindowDurationUnit) {
    case 'months':
      return addMonths;
    case 'weeks':
      return addWeeks;
    case 'days':
    default:
      return addDays;
  }
}

function getSubForTimeWindowUnit(timeWindowDurationUnit: TimeWindowDuration) {
  switch (timeWindowDurationUnit) {
    case 'months':
      return subMonths;
    case 'weeks':
      return subWeeks;
    case 'days':
    default:
      return subDays;
  }
}

function toFixedTimeConfig(from: number, to: number): TimeWindowConfig {
  return {
    timeConfig: {
      windowSize: to - from,
      to,
      focusedMoment: to,
      autoRefresh: false
    },
    fromTimestamp: from,
    toTimestamp: to
  };
}

function calculateTimeWindowConfig({
  timeConfig,
  isRolling,
  isFixed,
  timeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStartDate,
  timeWindowStartTime
}: CalculateTimeWindowConfigProps): TimeWindowConfig {
  let timeWindowConfig = { ...timeConfig };

  let fromTimestamp = (timeConfig.to ?? new Date().getTime()) - timeConfig.windowSize;
  let toTimestamp = timeConfig.to ?? fromTimestamp + timeConfig.windowSize;

  if (isRolling) {
    const subtraction = getSubForTimeWindowUnit(timeWindowDurationUnit);
    fromTimestamp = subtraction(new Date(toTimestamp), timeWindowDuration).getTime();
    return toFixedTimeConfig(fromTimestamp, toTimestamp);
  }

  if (isFixed) {
    const dateTime = timeWindowStartDate + ' ' + timeWindowStartTime;
    let timeWindowStartTimeStamp = parseTimestamp(dateTime);

    if (timeWindowStartTimeStamp) {
      const now = new Date();
      const addition = getAddForTimeWindowUnit(timeWindowDurationUnit);
      let nextStart = new Date(timeWindowStartTimeStamp);
      let latestIntervalStart;

      do {
        latestIntervalStart = nextStart;
        nextStart = addition(latestIntervalStart, timeWindowDuration);
      } while (isBefore(nextStart, now));

      fromTimestamp = latestIntervalStart.getTime();
      toTimestamp = nextStart.getTime();
      return toFixedTimeConfig(fromTimestamp, toTimestamp);
    }
  }

  return { timeConfig: timeWindowConfig, fromTimestamp, toTimestamp };
}

const oneWeekTimeConfig = {
  windowSize: days.toMillis(7),
  autoRefresh: false
};

interface UseWidgetTimeConfigProps {
  isPreview?: boolean;
  isRolling?: boolean;
  isFixed?: boolean;
  timeWindowDuration: number;
  timeWindowDurationUnit: TimeWindowDuration;
  timeWindowStartDate?: string;
  timeWindowStartTime?: string;
}

export default function useWidgetTimeConfig({
  isPreview,
  isRolling,
  isFixed,
  timeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStartDate,
  timeWindowStartTime
}: UseWidgetTimeConfigProps): TimeWindowConfig {
  const currentTimeConfig = useTimeConfig();
  const timeConfig = isPreview ? oneWeekTimeConfig : currentTimeConfig;

  return useMemo(
    () =>
      calculateTimeWindowConfig({
        timeConfig,
        isRolling,
        isFixed,
        timeWindowDuration,
        timeWindowDurationUnit,
        timeWindowStartDate,
        timeWindowStartTime
      }),
    [
      timeConfig,
      isRolling,
      isFixed,
      timeWindowDuration,
      timeWindowDurationUnit,
      timeWindowStartDate,
      timeWindowStartTime
    ]
  );
}
