/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { queryKey as highlightedTimeframeQueryKey } from 'in-stores/highlightedTimeframe';
import { setTimeConfig, timeConfig$ } from 'in-stores/time/config';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { alwaysNull } from 'in-services/fixedStreams';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

const MAX_ZOOM_LEVEL = minutes.toMillis(1);
const config = {
  name: 'zoomIn',
  icon: 'lib_datetime_time',
  label: t('in-components:chart.chartZoomInLabel'),
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

    return getModifiedUrlStream(location => {
      setTimeConfig(location, {
        windowSize,
        to,
        focusedMoment: to,
        autoRefresh: false
      });
      delete location.query[highlightedTimeframeQueryKey];
    });
  });
}
