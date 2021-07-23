/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ParameterDefinition } from 'in-stores/navigation/types';
import { formatDuration } from 'in-services/formatters/date';
import { TimeConfig, TimeShift } from 'in-types';
import { days, hours } from 'in-services/time';
import { t } from 'in-i18n';

export type TimeShiftOffset = number | 'auto';

const initialState = 0;

export const urlParameter: ParameterDefinition<TimeShiftOffset> = {
  name: 'ts',
  as: 'timeShiftOffset',
  parser: (v?: string) => {
    if (v == null) {
      return initialState;
    }

    if (v === 'auto') {
      return v;
    }

    const parsed = parseInt(v, 10);
    if (isNaN(parsed)) {
      return initialState;
    }
    return parsed;
  },
  serializer: (v: TimeShiftOffset) => {
    if (v === 'auto') {
      return v;
    }

    if (typeof v === 'number' && !isNaN(v) && v !== initialState) {
      return String(v);
    }

    return null;
  },
  initialState
};

export interface TimeShiftOption {
  offset: TimeShiftOffset;
  label: string;
  description: string;
  disallowSelection?: boolean;
}

export const defaultTimeShift: TimeShiftOption = {
  offset: initialState,
  label: t('in-stores:time.shiftingLabelOff'),
  description: t('in-stores:time.shiftingDescriptionOff')
};

export const previousHourTimeShift: TimeShiftOption = {
  offset: -1 * hours.toMillis(1),
  label: t('in-stores:time.shiftingLabelPreviousHour'),
  description: t('in-stores:time.shiftingDescriptionPreviousHour')
};

export const timeShifts: TimeShiftOption[] = [
  defaultTimeShift,
  {
    offset: 'auto',
    label: t('in-stores:time.shiftingLabelPreviousWindow'),
    description: t('in-stores:time.shiftingDescriptionPreviousWindow')
  },
  previousHourTimeShift,
  {
    offset: -1 * days.toMillis(1),
    label: t('in-stores:time.shiftingLabelYesterday'),
    description: t('in-stores:time.shiftingDescriptionYesterday')
  },
  {
    offset: -1 * days.toMillis(7),
    label: t('in-stores:time.shiftingLabelLastWeek'),
    description: t('in-stores:time.shiftingDescriptionLastWeek'),
    disallowSelection: true
  }
];

const defaultTimeShiftConfig: TimeShift = {
  offset: 0
};
export function translateOffsetToTimeShiftConfig(
  timeShift: TimeShiftOffset | TimeShift,
  timeConfig: TimeConfig
): TimeShift {
  if (timeShift == null) {
    return defaultTimeShiftConfig;
  } else if (typeof timeShift === 'number') {
    return {
      offset: timeShift
    };
  } else if (timeShift === 'auto') {
    return {
      offset: -1 * timeConfig.windowSize
    };
    // Allow to pass in timeShift configurations instead of numbers/auto directly
  } else if (timeShift.offset != null) {
    return translateOffsetToTimeShiftConfig(timeShift.offset, timeConfig);
  }

  return defaultTimeShiftConfig;
}

export function getTimeShiftLabel(timeShift: TimeShift): string {
  if (!timeShift) {
    return defaultTimeShift.label;
  }

  for (let i = 0; i < timeShifts.length; i++) {
    const eachTimeShift = timeShifts[i];
    if (eachTimeShift.offset === timeShift.offset) {
      return eachTimeShift.label;
    }
  }

  return t('in-stores:time.shiftingCustomDuration', { duration: formatDuration(Math.abs(timeShift.offset)) });
}
