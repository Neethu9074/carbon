/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEqual } from 'lodash';
import rpt from 'prop-types';

import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { Location, Parameters } from 'in-stores/navigation/types';
import { days, hours, minutes } from 'in-services/time';
import { isBlank } from 'in-services/util/string';
import { TimeConfig, Result } from 'in-types';

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

export const timeConfig$ = navigationParameters$.map(getTimeConfig).distinct((prev, next) => !isEqual(prev, next));

export function getTimeConfig(location: Location): TimeConfig {
  const to = getInt(location.query, urlQueryKeys.to, null);
  return {
    to,
    windowSize: Math.min(
      maximumWindowSize,
      Math.max(minimumWindowSize, getInt(location.query, urlQueryKeys.windowSize, defaultWindowSize))
    ),
    focusedMoment: to == null ? null : getInt(location.query, urlQueryKeys.focusedMoment, to),
    autoRefresh: to == null && location.query[urlQueryKeys.autoRefresh] === 'true'
  };
}

export interface FixedTimeConfig {
  readonly windowSize: number;
  readonly to: number;
  readonly focusedMoment?: number;
  readonly autoRefresh: boolean;
}

export function fixateTimeConfig(timeConfig: TimeConfig): FixedTimeConfig {
  if (timeConfig.to != null) {
    return timeConfig as FixedTimeConfig;
  }
  const now = Date.now();

  return {
    to: now,
    focusedMoment: now,
    autoRefresh: false,
    windowSize: timeConfig.windowSize
  };
}

function getInt(query: Parameters, key: string, fallback: number): number;
function getInt(query: Parameters, key: string, fallback: null): number | null;
function getInt(query: Parameters, key: string, fallback: number | null): number | null {
  const value = query[key];
  if (value == null || isBlank(value)) {
    return fallback;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

export function getTimeConfigAtMoment(moment: number): TimeConfig {
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

export function getTimeConfigAlignedToResultTime(timeConfig: TimeConfig, result: Result<any>): TimeConfig {
  return {
    windowSize: timeConfig.windowSize,
    autoRefresh: timeConfig.autoRefresh && result.time == null,
    to: result.time,
    focusedMoment: result.time
  };
}

export function setTimeConfig(location: Location, timeConfig: TimeConfig) {
  if (timeConfig.windowSize != null) {
    location.query[urlQueryKeys.windowSize] = String(timeConfig.windowSize);
  }

  if (timeConfig.to === undefined) {
    delete location.query[urlQueryKeys.to];
  } else {
    location.query[urlQueryKeys.to] = String(timeConfig.to == null ? '' : timeConfig.to);
  }

  if (timeConfig.focusedMoment === undefined) {
    delete location.query[urlQueryKeys.focusedMoment];
  } else {
    location.query[urlQueryKeys.focusedMoment] = String(
      timeConfig.focusedMoment == null ? '' : timeConfig.focusedMoment
    );
  }

  if (timeConfig.autoRefresh !== undefined) {
    location.query[urlQueryKeys.autoRefresh] = String(Boolean(timeConfig.autoRefresh));
  }

  // TODO get rid of this confusing/wrong API
  // @ts-expect-error
  if (timeConfig.clearHighlightedTimeframe) {
    delete location.query['tl.tf'];
  }
}
