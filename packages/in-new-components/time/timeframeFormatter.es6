import { formatDurationAccurately, formatDateTime } from 'in-services/formatters/date';
import { getFixedTimePresets } from 'in-new-components/time/timePresets';

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
  return `${formatDateTime(timeframe.to - timeframe.windowSize)} to ${formatDateTime(timeframe.to)}`;
}
