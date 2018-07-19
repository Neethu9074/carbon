import { isEqual } from 'lodash';
import rpt from 'prop-types';

import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { createTrackingStore } from 'in-stores/store';
import { isBlank } from 'in-services/util/string';

export const urlQueryKeys = Object.freeze({
  to: 'timeline.to',
  windowSize: 'timeline.ws',
  focusedMoment: 'timeline.fm',
  autoRefresh: 'timeline.ar'
});

export const timeConfigShape = rpt.shape({
  windowSize: rpt.number.isRequired,
  to: rpt.number,
  focusedMoment: rpt.number,
  autoRefresh: rpt.bool
});

const minimumWindowSize = 1000 * 60;
const maximumWindowSize = 1000 * 60 * 60 * 24 * 31;
// if we are in the app 2.0 world, we want to see the last hour instead of the last 10 minutes
const defaultWindowSize = twoZeroModeEnabled ? 1000 * 60 * 60 : 1000 * 60 * 10;

export const timeConfig$ = createTrackingStore({
  name: 'time/config',
  observable: navigationParameters$.map(getTimeConfig).distinct((prev, next) => !isEqual(prev, next))
}).observable;

export function getTimeConfig(params) {
  const to = getInt(params.query, urlQueryKeys.to, null);
  return {
    to,
    windowSize: Math.min(
      maximumWindowSize,
      Math.max(minimumWindowSize, getInt(params.query, urlQueryKeys.windowSize, defaultWindowSize))
    ),
    focusedMoment: to == null ? null : getInt(params.query, urlQueryKeys.focusedMoment, to),
    autoRefresh: to == null && (!twoZeroModeEnabled || params.query[urlQueryKeys.autoRefresh] === 'true')
  };
}

function getInt(query, key, fallback) {
  const value = query[key];
  if (isBlank(value)) {
    return fallback;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

export function getTimeConfigAtMoment(moment) {
  return {
    windowSize: defaultWindowSize,
    to: moment,
    focusedMoment: moment,
    autoRefresh: false
  };
}

export function getWaitForEntityCreationTimeConfig() {
  return {
    windowSize: 1000 * 60,
    to: null,
    focusedMoment: null,
    autoRefresh: true
  };
}

export function getTimeConfigAlignedToResultTime(timeConfig, result) {
  return {
    windowSize: timeConfig.windowSize,
    autoRefresh: timeConfig.autoRefresh && result.time == null,
    to: result.time,
    focusedMoment: result.time
  };
}
