import { formatDuration } from 'in-services/formatters/date';

export const defaultTimeShift = {
  offset: 0,
  label: `No time shift`
};

export const timeShifts = [
  defaultTimeShift,
  {
    offset: 'auto',
    label: `Previous time window`
  },
  {
    offset: -1 * 1000 * 60 * 60,
    label: `Previous hour`
  },
  {
    offset: -1 * 1000 * 60 * 60 * 24,
    label: `Yesterday`
  },
  {
    offset: -1 * 1000 * 60 * 60 * 24 * 7,
    label: `Last week`,
    disallowSelection: true
  }
];

const noTimeShiftingConfig = {
  offset: 0
};

export function translateOffsetToTimeShiftConfig(timeShift, timeConfig) {
  if (timeShift == null) {
    return noTimeShiftingConfig;
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

  return noTimeShiftingConfig;
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
