import { formatDurationAccurately, formatDateTime, formatTime } from 'in-services/formatters/date';
import { getFixedTimePresets } from 'in-new-components/time/timePresets';
import { isOnSameDay } from 'in-services/util/date';

export default function format(timeframe) {
  const preset = getFixedTimePresets().find(p => p.to === timeframe.to && p.windowSize === timeframe.windowSize);
  if (preset) {
    return preset.label;
  }

  if (timeframe.to == null) {
    const result = `Last ${formatDurationAccurately(timeframe.windowSize, 60000, false)}`;
    const match = result.match(/^Last 1 ([a-z]+)$/i);
    if (!match) {
      return result;
    }
    return `Last ${match[1]}`;
  }

  const fromTime = timeframe.to - timeframe.windowSize;
  const toTime = timeframe.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatDateTime(fromTime)} to ${formatTime(toTime)} (${formatDurationAccurately(timeframe.windowSize)})`;
  } else {
    return `${formatDateTime(fromTime)} to ${formatDateTime(toTime)} (${formatDurationAccurately(
      timeframe.windowSize
    )})`;
  }
}
