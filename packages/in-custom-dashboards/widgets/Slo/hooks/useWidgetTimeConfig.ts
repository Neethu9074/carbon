/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useMemo } from 'react';
import moment from 'moment';

import { parsedTimestamp, TimeWindowDuration } from 'in-custom-dashboards/widgets/Slo/form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time/time';
import { TimeConfig } from 'in-types';

interface CalculateTimeWindowConfigProps {
  timeConfig: TimeConfig;
  isRolling?: boolean;
  isFixed?: boolean;
  timeWindowDuration: number;
  timeWindowDurationUnit: TimeWindowDuration;
  timeWindowStartDate?: string;
  timeWindowStartTime?: string;
}

interface TimeWindowConfig {
  timeConfig: TimeConfig;
  fromTimestamp: number;
  toTimestamp: number;
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
  const timeWindowConfig = { ...timeConfig };

  let fromTimestamp = (timeConfig.to ?? new Date().getTime()) - timeConfig.windowSize;
  let toTimestamp = timeConfig.to ?? fromTimestamp + timeConfig.windowSize;

  if (isRolling) {
    fromTimestamp = moment(toTimestamp)
      .subtract(timeWindowDuration, timeWindowDurationUnit)
      .valueOf();
    timeWindowConfig.windowSize = toTimestamp - fromTimestamp;
  }

  if (isFixed) {
    let timeWindowStartTimeStamp = parsedTimestamp(timeWindowStartDate + '  ' + timeWindowStartTime);
    if (timeWindowStartTimeStamp) {
      let now = moment();
      let nextStart = moment(timeWindowStartTimeStamp);
      let latestIntervalStart;
      do {
        latestIntervalStart = nextStart;
        nextStart = latestIntervalStart.clone().add(timeWindowDuration, timeWindowDurationUnit);
      } while (nextStart.isBefore(now));

      fromTimestamp = latestIntervalStart.valueOf();
      toTimestamp = nextStart.valueOf();
      timeWindowConfig.windowSize = nextStart.valueOf() - fromTimestamp;
    }
  }
  if (!timeConfig.autoRefresh) {
    timeWindowConfig.to = toTimestamp;
    timeWindowConfig.focusedMoment = toTimestamp;
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
