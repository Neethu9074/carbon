import { formatDurationAccurately, formatDateTime, formatTime, formatDateShort } from 'in-services/formatters/date';
import { getFixedTimePresets } from 'in-new-components/time/timePresets';
import { isOnSameDay } from 'in-services/util/date';

export function format(timeConfig) {
  const preset = getFixedTimePresets().find(p => p.to === timeConfig.to && p.windowSize === timeConfig.windowSize);
  if (preset) {
    return preset.label;
  }

  if (timeConfig.to == null) {
    const result = `Last ${formatDurationAccurately(timeConfig.windowSize, 60000, false)}`;
    const match = result.match(/^Last 1 ([a-z]+)$/i);
    if (match && match[1] === 'day') {
      return 'Last 24 hours';
    } else if (match) {
      return `Last ${match[1]}`;
    } else {
      return result;
    }
  }

  const fromTime = timeConfig.to - timeConfig.windowSize;
  const toTime = timeConfig.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatDateTime(fromTime)} to ${formatTime(toTime)} (${formatDurationAccurately(timeConfig.windowSize)})`;
  } else {
    return `${formatDateTime(fromTime)} to ${formatDateTime(toTime)} (${formatDurationAccurately(
      timeConfig.windowSize
    )})`;
  }
}

export function timeDisplayTopFormat(timeConfig) {
  const currentTime = Date.now();
  if (timeConfig.autoRefresh == true) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatDateShort(fromTime)}`;
    } else {
      return `Starting ${formatDateShort(fromTime)}`;
    }
  }

  if (timeConfig.to == null) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatDurationAccurately(timeConfig.windowSize)} - ${formatDateShort(fromTime)}`;
    } else {
      return formatDurationAccurately(timeConfig.windowSize, 60000, false);
    }
  }

  const fromTime = timeConfig.to - timeConfig.windowSize;
  const toTime = timeConfig.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatDurationAccurately(timeConfig.windowSize)} - ${formatDateShort(fromTime)}`;
  } else {
    return formatDurationAccurately(timeConfig.windowSize, 60000, false);
  }
}

export function timeDisplayBottomFormat(timeConfig) {
  const currentTime = Date.now();
  if (timeConfig.autoRefresh == true) {
    const result = `Last ${formatDurationAccurately(timeConfig.windowSize, 60000, false)}`;
    const match = result.match(/^Last 1 ([a-z]+)$/i);
    if (match && match[1] === 'day') {
      return 'Last 24 hours';
    } else if (match) {
      return `Last ${match[1]}`;
    } else {
      return result;
    }
  }

  if (timeConfig.to == null) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatTime(fromTime)} - ${formatTime(currentTime)}`;
    } else {
      return `${formatDateShort(fromTime)} - ${formatDateShort(currentTime)}`;
    }
  }

  const fromTime = timeConfig.to - timeConfig.windowSize;
  const toTime = timeConfig.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatTime(fromTime)} - ${formatTime(toTime)}`;
  } else {
    return `${formatDateShort(fromTime)} - ${formatDateShort(toTime)}`;
  }
}
