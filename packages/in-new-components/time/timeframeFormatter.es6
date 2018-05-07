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
    if (!match) {
      return result;
    }
    return `Last ${match[1]}`;
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
