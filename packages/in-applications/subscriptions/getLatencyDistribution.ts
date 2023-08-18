/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GetLatencyDistributionBase10Query, LatencyDistributionBase10, Result } from '@instana/types';
import { combineLatest, Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { merge } from 'in-services/util/resultMerger';
import { Mutable } from 'in-types';

const getLatencyDistributionBase10Internal = createResultSubscriptionFactory<
  GetLatencyDistributionBase10Query,
  Result<LatencyDistributionBase10>
>({
  eventId: 'getLatencyDistributionBase10',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});

// Split a single getLatencyDistributionBase10 call into multiple subscriptions.
// Splitting the getLatencyDistributionBase10 call into multiple subscriptions
// improves UI caching. Instead of caching one getLatencyDistributionBase10 call
// for multiple groups, we cache one getLatencyDistributionBase10 for one group.
//
// This in turn causes the caching to improve for scenarios where a
// subset of the group may change in response to user input.
export default function getLatencyDistribution(
  params: GetLatencyDistributionBase10Query
): Observable<Result<LatencyDistributionBase10>> {
  const { grouping, includePercentiles } = params;
  if (grouping) {
    const observables = grouping.groups.map(group =>
      getLatencyDistributionBase10Internal({
        ...params,
        // we do not need percentiles for each of the groups
        includePercentiles: false,
        grouping: {
          ...grouping,
          groups: [group]
        }
      })
    );
    if (includePercentiles) {
      const { grouping, ...ungrouped } = params;
      observables.push(getLatencyDistributionBase10Internal(ungrouped));
    }
    return combineLatest(observables, true).map(mergeResults);
  }
  return getLatencyDistributionBase10Internal(params);
}

function mergeResults(results: Result<LatencyDistributionBase10>[]) {
  return merge(results, mergeResultData);
}

function mergeResultData(partialResults: LatencyDistributionBase10[]): LatencyDistributionBase10 {
  let result: Mutable<LatencyDistributionBase10> = {
    buckets: [],
    groups: []
  };
  for (const data of partialResults) {
    if (data.groups) {
      result.groups!.push(...data.groups);
    } else {
      result.buckets = data.buckets;
      result.percentiles = data.percentiles;
    }
  }
  return result;
}
