import { getFixedTimeframeUrl } from 'in-stores/timeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { minutes } from 'in-services/time';

const MAX_ZOOM_LEVEL = minutes.toMillis(1);
const config = {
  name: 'zoomIn',
  icon: 'lib_datetime_time',
  label: 'Zoom to time range',
  getHref$: getHighlightedTimeframeUrl$
};
export default config;

function getHighlightedTimeframeUrl$(highlightedTimeframe) {
  return timeConfig$.flatMap(originalTimeConfig => {
    if (!highlightedTimeframe) {
      return alwaysNull;
    }

    const timeConfig = {
      ...originalTimeConfig
    };

    const from = highlightedTimeframe[0];
    let to = highlightedTimeframe[1];
    let windowSize = to - from;

    if (windowSize <= MAX_ZOOM_LEVEL) {
      windowSize = MAX_ZOOM_LEVEL;
    }

    if (timeConfig.focusedMoment > to || timeConfig.focusedMoment < from) {
      timeConfig.focusedMoment = to;
    }

    return getFixedTimeframeUrl({
      windowSize,
      to,
      focusedMoment: timeConfig.focusedMoment,
      clearHighlightedTimeframe: true
    });
  });
}
