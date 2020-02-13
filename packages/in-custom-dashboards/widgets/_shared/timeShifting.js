export const defaultTimeShift = {
  offset: 0,
  label: `No time shift`
};

export const timeShifts = [
  defaultTimeShift,
  {
    offset: 'auto',
    label: `Previous time window`
  }
];

export function translateStoredValueToTimeShiftConfig(timeShift, timeConfig) {
  if (typeof timeShift === 'number') {
    return {
      offset: timeShift
    };
  } else if (timeShift === 'auto') {
    return {
      offset: -1 * timeConfig.windowSize
    };
  }
  return null;
}
