/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { formatDuration } from 'in-services/formatters/date';
import { days, hours } from 'in-services/time';
import { t } from 'in-i18n';


const initialState = 0;

export const urlParameter = {
  name: 'ts',
  as: 'timeShiftOffset',
  parser: v => {
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
  serializer: v => {
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

export const defaultTimeShift = {
  offset: initialState,
  label: t('in-stores:time.shiftingLabelOff'),
  description: t('in-stores:time.shiftingDescriptionOff')
};

export const previousHourTimeShift = {
  offset: -1 * hours.toMillis(1),
  label: t('in-stores:time.shiftingLabelPreviousHour'),
  description: t('in-stores:time.shiftingDescriptionPreviousHour')
};

export const timeShifts = [
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

export function translateOffsetToTimeShiftConfig(timeShift, timeConfig) {
  if (timeShift == null) {
    return defaultTimeShift;
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

  return defaultTimeShift;
}

export function getTimeShiftLabel(timeShift) {
  if (!timeShift) {
    return defaultTimeShift.label;
  }

  for (let i = 0; i < timeShifts.length; i++) {
    const eachTimeShift = timeShifts[i];
    if (eachTimeShift.offset === timeShift.offset) {
      return eachTimeShift.label;
    }
  }

  return `Previous ${formatDuration(Math.abs(timeShift.offset))}`;
}
