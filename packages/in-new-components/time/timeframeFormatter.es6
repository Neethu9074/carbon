import { formatDurationAccurately, formatDateTime, formatTime } from 'in-services/formatters/date';
import { getFixedTimePresets } from 'in-new-components/time/timePresets';
import { isOnSameDay } from 'in-services/util/date';

export default function format(timeConfig) {
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
