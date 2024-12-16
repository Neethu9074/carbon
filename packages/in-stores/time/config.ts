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

export function trimTimeConfigEnd(timeConfig: FixedTimeConfig, maxWindowSize: number): FixedTimeConfig {
  if (timeConfig.windowSize < maxWindowSize) {
    return timeConfig;
  }

  const diff = timeConfig.windowSize - maxWindowSize;
  const trimmedTo = timeConfig.to - diff;
  const trimmedFocusedMoment =
    timeConfig.focusedMoment == null ? trimmedTo : Math.min(timeConfig.focusedMoment, trimmedTo);

  return {
    to: trimmedTo,
    focusedMoment: trimmedFocusedMoment,
    autoRefresh: timeConfig.autoRefresh,
    windowSize: maxWindowSize
  };
}

function timeConfigWithShift(timeConfig: TimeConfig, timeSkew: number) {
  // live mode needs to query with empty to field
  // historical data does not need to be skewed
  if (timeConfig.autoRefresh || timeConfig.to !== null) {
    return timeConfig;
  }
  const now = Date.now() - timeSkew;

  return {
    ...timeConfig,
    to: now,
    focusedMoment: now
  };
}

// When displaying metrics until now, the ingestion pipeline has not had time to fully ingest entities
// Ingestion time is about 10s, so charts should not go further than present time - 10s to avoid drops at end of charts due to incomplete ingestion
const timeSkew = 10000;

export function timeConfigShiftedForIngestion(timeConfig: TimeConfig) {
  return timeConfigWithShift(timeConfig, timeSkew);
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

export function getTimeConfigAtMoment(moment: number | null): TimeConfig {
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

export function setTimeConfig(location: Location, timeConfig: Partial<TimeConfig>) {
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

/**
 * Returns adjusted 'timeConfig' such that its time range includes the specified 'timestamp'.
 * If the 'timestamp' is already included then unmodified 'timeConfig' will be returned.
 *
 * Note that the requested time frame can be adjusted (shrunk) in the backend in order to exclude
 * partial buckets for granularity metrics, e.g. for charts. This could result in the specified
 * 'timestamp' being excluded. Since finding out by how much the time frame needs to be extended
 * to avoid its adjustment in the backend can become quite complicated, we will use a simple approach
 * by extending the window size by an additional "safety" bucket. Choosing the right size of the
 * "safety" bucket is not that easy, because bucket size (granularity) depends on window size
 * and extending window size may result in also extending the granularity. To keep it simple
 * we multiply the current granularity by the max factor between two consecutive granularities.
 * This way we will get a bucket size which is the same or greater than the next granularity.
 */
export function getAdjustedTimeConfigToIncludeTimestamp(
  timeConfig: TimeConfig,
  timestamp: number,
  granularityProvider: (config: Pick<TimeConfig, 'windowSize'>) => number,
  // allow to inject 'now' for testing
  nowFunc: () => number = Date.now
): TimeConfig {
  // The biggest jump in size between two consecutive granularities is between 10 seconds
  // and 1 minute by factor 6, see packages/in-stores/metric/metric.js#sensibleGranularities.
  const MAX_FACTOR_BETWEEN_GRANULARITIES = 6;
  // subtract a small wiggle room, otherwise the 'fullRetentionCutOff' timestamp would immediately expire
  const DEFAULT_FULL_DATA_RETENTION = days.toMillis(7) - minutes.toMillis(5);

  if (timeConfig.to != null && timestamp > timeConfig.to) {
    // timestamp lays after the selected time range => adjusting the upper limit
    let newTo = timestamp;
    let newWindowSize = timeConfig.windowSize + (newTo - timeConfig.to);

    const fullRetentionCutOff = nowFunc() - DEFAULT_FULL_DATA_RETENTION;
    if (newTo > fullRetentionCutOff + minimumWindowSize && newTo - newWindowSize < fullRetentionCutOff) {
      // if the selected time range crosses the full data retention cut-off, adjust the window size to
      // fit within the full data retention time range
      newWindowSize = newTo - fullRetentionCutOff;
    }

    const granularity = granularityProvider({ windowSize: newWindowSize });
    const safetyBucket = granularity * MAX_FACTOR_BETWEEN_GRANULARITIES;
    newTo = newTo + safetyBucket;
    // ensure the window size does not exceed the limit
    newWindowSize = Math.min(newWindowSize + safetyBucket, maximumWindowSize);
    return {
      autoRefresh: timeConfig.autoRefresh,
      windowSize: newWindowSize,
      to: newTo,
      ...(timeConfig.focusedMoment && newTo && { focusedMoment: newTo })
    };
  }

  const toOrNow = timeConfig.to ?? nowFunc();
  const from = toOrNow - timeConfig.windowSize;
  if (timestamp < from) {
    // timestamp lays before the selected time range => adjusting the lower limit
    let newWindowSize = toOrNow - timestamp;
    const granularity = granularityProvider({ windowSize: newWindowSize });
    const safetyBucket = granularity * MAX_FACTOR_BETWEEN_GRANULARITIES;
    // ensure the window size does not exceed the limit
    newWindowSize = Math.min(newWindowSize + safetyBucket, maximumWindowSize);
    const newTo = newWindowSize === maximumWindowSize ? timestamp - safetyBucket + maximumWindowSize : timeConfig.to;
    return {
      autoRefresh: timeConfig.autoRefresh,
      windowSize: newWindowSize,
      ...(newTo && { to: newTo }),
      ...(timeConfig.focusedMoment && newTo && { focusedMoment: newTo })
    };
  }

  return timeConfig;
}
