/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, timeout, Observable } from '@instana/observables';

import {
  GetUnifiedMetricsQuery,
  HistogramMetricResult,
  LabeledMetricResult,
  MetricResult,
  Result,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { apMetricsDeltaFetchingEnabled } from 'in-services/featureFlags';
import { merge } from 'in-services/util/resultMerger';
import { isBlank } from 'in-services/util/string';

export type UnifiedMetricsResult = MetricResult | LabeledMetricResult | HistogramMetricResult;

export function isLabeledMetricResult(resultData: UnifiedMetricsResult): resultData is LabeledMetricResult {
  const possiblyLabeledResult = resultData as LabeledMetricResult;
  return possiblyLabeledResult.label != null && !isBlank(possiblyLabeledResult.label);
}

// Split a single getUnifiedMetrics call into multiple subscriptions.
// This improves UI caching: Instead of caching one getUnifiedMetrics call for multiple metrics,
// we cache one getUnifiedMetrics for one metric. This in turn causes the caching to improve
// for scenarios where a subset of the metrics may change in response to user input.
export default function getUnifiedMetrics(
  // rbacRestrictions in the query are currently ignored
  { metrics }: GetUnifiedMetricsQuery,
  bulkRequest = false,
  extraOpts = {}
): Observable<Result<UnifiedMetricsResult[]>> {
  if (bulkRequest) {
    return combineLatest([getUnifiedMetricsInternal({ metrics })]).map(mergeResults);
  }

  const observables = Object.entries(metrics).map(([metricId, metricConfig]) =>
    getUnifiedMetricsInternalDeltaFetching({ metricId, metricConfig }, extraOpts)
  );
  return combineLatest(observables).map(mergeResults);
}

function mergeResults(results: Result<UnifiedMetricsResult[]>[]) {
  return merge(results, mergeResultData);
}

function mergeResultData(dataSets: UnifiedMetricsResult[][]): UnifiedMetricsResult[] {
  const merged = [];
  for (const data of dataSets) {
    merged.push(...data);
  }
  return merged;
}

const getUnifiedMetricsInternal = createResultSubscriptionFactory<
  GetUnifiedMetricsQuery,
  Result<UnifiedMetricsResult[]>
>({
  eventId: 'getUnifiedMetrics',
  trackSubscriptionStatistics: true
});

function getUnifiedMetricsInternalWithOpts(extraOpts: object) {
  return createResultSubscriptionFactory<GetUnifiedMetricsQuery, Result<UnifiedMetricsResult[]>>({
    ...extraOpts,
    eventId: 'getUnifiedMetrics',
    trackSubscriptionStatistics: true
  });
}

// GetUnifiedMetricsQuery with just a single metric
export /*for testing*/ interface GetSingleUnifiedMetricQuery {
  readonly metricId: string;
  readonly metricConfig: UnifiedMetricConfigurationUnion;
  // currently, rbacRestrictions are not passed down
  // readonly rbacRestrictions?: RbacRestrictions;
}

// convert back to a GetUnifiedMetricsQuery for passing to backend subscription
function fullQuery(query: GetSingleUnifiedMetricQuery): GetUnifiedMetricsQuery {
  return {
    metrics: {
      [query.metricId]: query.metricConfig
    }
  };
}

// For auto-refresh metrics, try to split the metrics request into a one-time "full request" and an auto-refreshed
// "delta request" that only re-fetches the last buckets.
// Reducing the timeframe for the repeated delta requests allows the backend to apply dynamic optimizations more quickly,
// because they can only be used if the optimization has been enabled for the entire queried timeframe
function getUnifiedMetricsInternalDeltaFetching(
  query: GetSingleUnifiedMetricQuery,
  extraOpts: object
): Observable<Result<UnifiedMetricsResult[]>> {
  const splitRequests = splitQueryForDeltaFetching(query);
  if (!splitRequests) {
    return getUnifiedMetricsInternalWithOpts(extraOpts)(fullQuery(query));
  }

  const { fullRequest, deltaRequest, requestedWindowSize, granularity } = splitRequests;
  const { replaceCacheWithFullData, updateCacheWithDeltaData } = prepareCache(requestedWindowSize);
  const fullDataOpts = {
    // when getUnifiedMetricsInternalDeltaFetching gets called again (with a new cache) after live mode stop/restart,
    // we need to have full data again for the current window. force a request to the server if the last memoized
    // full request is not up-to-date.
    // we don't need this for the auto-refreshing delta request, because either the server subscription is still active,
    // and the memoized data got updated in the background, or it has been canceled and we'll perform a new server request
    // anyway.
    memoizeFor: Math.floor(granularity / 2)
  };

  // apply cache handlers to results from both observables
  const fullObservable = getUnifiedMetricsInternalWithOpts(fullDataOpts)(fullRequest).map(replaceCacheWithFullData);
  const deltaObservable = timeout(granularity) // defer first delta request by one bucket duration
    .flatMap(() => getUnifiedMetricsInternal(deltaRequest))
    // avoid flickering progress indicator from delta request after full data has already been returned
    .filter(result => !result.progress?.loading)
    .map(updateCacheWithDeltaData);

  // whenever one observable emits, downstream the result from the respective cache handler
  return fullObservable.merge(deltaObservable);
}

// Split an unified metrics request into full request and delta fetching request, if applicable.
// Return null otherwise.
export /*for testing*/ function splitQueryForDeltaFetching(query: GetSingleUnifiedMetricQuery): {
  fullRequest: GetUnifiedMetricsQuery;
  deltaRequest: GetUnifiedMetricsQuery;
  requestedWindowSize: number;
  granularity: number;
} | null {
  const metricConfig = query.metricConfig;
  if (!isDeltaFetchingSupported(metricConfig.source)) {
    return null;
  }
  if (!metricConfig.granularity || !metricConfig.timeConfig.autoRefresh) {
    return null;
  }

  const requestedWindowSize = metricConfig.timeConfig.windowSize;
  const granularity = metricConfig.granularity;

  // we should always query buckets for the last minute, as this data may still be updated from "late arriving" calls
  const minDeltaWindowSize = 60 * 1000;
  // request at least 2 buckets to ensure overlap with existing data
  const minDeltaBuckets = 2;
  // add an extra bucket, as window alignment may reduce the number of returned buckets by one
  const deltaBuckets = Math.max(Math.ceil(minDeltaWindowSize / granularity), minDeltaBuckets) + 1;
  const deltaWindowSize = deltaBuckets * granularity;
  if (requestedWindowSize <= deltaWindowSize * 2) {
    return null; // no need to apply delta fetching if we don't reduce the window size enough
  }

  const timeConfigNoAutoRefresh = {
    ...metricConfig.timeConfig,
    autoRefresh: false
  };
  const fullRequest = overrideTimeConfig(query, timeConfigNoAutoRefresh);
  const timeConfigShortWindow = {
    ...metricConfig.timeConfig,
    windowSize: deltaWindowSize
  };
  const deltaRequest = overrideTimeConfig(query, timeConfigShortWindow);
  return { fullRequest, deltaRequest, requestedWindowSize, granularity };
}

function isDeltaFetchingSupported(source: String | undefined): boolean {
  switch (source) {
    // currently, we only use this for application metrics requests. other teams could extend this if
    // their backend implementations also profit from delta fetching
    case 'APPLICATION':
      return apMetricsDeltaFetchingEnabled;
    default:
      return false;
  }
}

function overrideTimeConfig(query: GetSingleUnifiedMetricQuery, newTimeConfig: TimeConfig): GetUnifiedMetricsQuery {
  return {
    metrics: {
      [query.metricId]: {
        ...query.metricConfig,
        timeConfig: newTimeConfig
      }
    }
  };
}

// Set up a result cache and return two cache handlers (result mapper functions).
// 'replaceCacheWithFullData' passes on the received full result but also replaces the cache with the
// result data.
// 'updateCacheWithDeltaData' merges the cache contents with the received delta result and returns a
// result containing the merged data.
export /*for testing*/ function prepareCache(requestedWindowSize: number): {
  replaceCacheWithFullData: (res: Result<UnifiedMetricsResult[]>) => Result<UnifiedMetricsResult[]>;
  updateCacheWithDeltaData: (res: Result<UnifiedMetricsResult[]>) => Result<UnifiedMetricsResult[]>;
} {
  let cachedValues: number[][] = [];
  let cacheWindowSize = requestedWindowSize;

  const replaceCacheWithFullData = (result: Result<UnifiedMetricsResult[]>) => {
    // both results only provide a single metric, otherwise we don't use delta fetching
    const fullData = result.data?.[0];
    if (fullData) {
      cachedValues = sortMetricValuesByTimestamp(fullData);
      // use adjusted window size from the full data for future cache updates, if available
      cacheWindowSize = fullData.adjustedTimeframe?.windowSize || cacheWindowSize;
    }
    return result;
  };

  const updateCacheWithDeltaData = (result: Result<UnifiedMetricsResult[]>) => {
    const deltaData = result.data?.[0];
    const newValues = sortMetricValuesByTimestamp(deltaData);
    if (cachedValues.length === 0 || newValues.length === 0) {
      // pass on progress and other incomplete results
      return result;
    }

    cachedValues = mergeIntoCache(cachedValues, newValues, cacheWindowSize);
    // Replace result data with cache and fix up the window size in 2 places.
    return {
      ...result,
      adjustedWindowSize: cacheWindowSize,
      data: [
        {
          ...deltaData,
          adjustedTimeframe: {
            ...deltaData?.adjustedTimeframe,
            windowSize: cacheWindowSize
          },
          values: cachedValues
        }
      ] as UnifiedMetricsResult[]
    };
  };

  return {
    replaceCacheWithFullData,
    updateCacheWithDeltaData
  };
}

// return an empty array if dataSet is undefined or has no values
function sortMetricValuesByTimestamp(dataSet: UnifiedMetricsResult | undefined): number[][] {
  // create a writable copy for sorting
  return dataSet?.values?.slice().sort((a, b) => a[0] - b[0]) ?? [];
}

function mergeIntoCache(cachedValues: number[][], newValues: number[][], requestedWindowSize: number): number[][] {
  // elements in cachedValues + newValues are sorted, remove all elements from the end of cache that are same or later
  // than the first timestamp in new data
  const firstNewTs = newValues[0][0];
  // 0 if not found -> keep nothing
  const earliestIndexToRemove = cachedValues.findLastIndex(el => el[0] < firstNewTs) + 1;

  // remove elements from start of cache that are outside the requested window size relative to the newest
  // available data point
  const lastNewTs = newValues[newValues.length - 1][0];
  const earliestTsToKeep = lastNewTs - requestedWindowSize;
  const earliestIndexToKeep = cachedValues.findIndex(el => el[0] >= earliestTsToKeep);
  // if nothing found, delete all elements from the array
  const skipCount = earliestIndexToKeep >= 0 ? earliestIndexToKeep : cachedValues.length;

  // if skipCount >= earliestIndexToRemove, slice() returns an empty array
  return cachedValues.slice(skipCount, earliestIndexToRemove).concat(newValues);
}
