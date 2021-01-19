/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isEqual } from 'lodash';
import rpt from 'prop-types';

import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { days, hours, minutes } from 'in-services/time';
import { createTrackingStore } from 'in-stores/store';
import { isBlank } from 'in-services/util/string';

export const urlQueryKeys = Object.freeze({
  to: 'timeline.to',
  windowSize: 'timeline.ws',
  focusedMoment: 'timeline.fm',
  autoRefresh: 'timeline.ar'
});

export const urlParameters = [
  { name: urlQueryKeys.to },
  { name: urlQueryKeys.windowSize },
  { name: urlQueryKeys.focusedMoment },
  { name: urlQueryKeys.autoRefresh }
];

export const propTypeTimeConfig = rpt.shape({
  windowSize: rpt.number.isRequired,
  to: rpt.number,
  focusedMoment: rpt.number,
  autoRefresh: rpt.bool
});
const minimumWindowSize = minutes.toMillis(1);
export const maximumWindowSize = days.toMillis(31);
export const defaultWindowSize = hours.toMillis(1);

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
    autoRefresh: to == null && params.query[urlQueryKeys.autoRefresh] === 'true'
  };
}

export function fixateTimeConfig(timeConfig) {
  if (timeConfig.to != null) {
    return timeConfig;
  }
  const now = Date.now();

  return {
    to: now,
    focusedMoment: now,
    autoRefresh: false,
    windowSize: timeConfig.windowSize
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
    windowSize: minutes.toMillis(10),
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

export function setTimeConfig(location, timeConfig) {
  if (timeConfig.windowSize != null) {
    location.query[urlQueryKeys.windowSize] = timeConfig.windowSize;
  }

  if (timeConfig.to === undefined) {
    delete location.query[urlQueryKeys.to];
  } else {
    location.query[urlQueryKeys.to] = timeConfig.to == null ? '' : timeConfig.to;
  }

  if (timeConfig.focusedMoment === undefined) {
    delete location.query[urlQueryKeys.focusedMoment];
  } else {
    location.query[urlQueryKeys.focusedMoment] = timeConfig.focusedMoment == null ? '' : timeConfig.focusedMoment;
  }

  if (timeConfig.autoRefresh !== undefined) {
    location.query[urlQueryKeys.autoRefresh] = String(Boolean(timeConfig.autoRefresh));
  }

  if (timeConfig.clearHighlightedTimeframe) {
    delete location.query['tl.tf'];
  }
}
