/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  EumMetricConfiguration,
  ApplicationMetricConfiguration,
  TagFilterExpressionElementUnion,
  TimeConfig,
  Error,
  Progress,
  Result,
  EumBeaconByTraceBeaconsItem,
  CursorPaginatedResult
} from '@instana/types';
import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getEumBeaconByTrace, { makeEumBeaconByTraceQuery } from 'in-eum/subscriptions/getEumBeaconByTrace';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState, FetchStatus } from 'in-hooks/utils/types';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';
import { success } from 'in-services/util/result';
import { hours } from 'in-services/time';

// currently we'll only show impacted users in last 24 hours (alert.end or now - 24h) to avoid big queries.
// in future, we'll force granularity in the data and split big query into smaller ones.
const maxImpactedUserWindowSize = hours.toMillis(24);
const minImpactedUserWindowSizeForEstimation = hours.toMillis(1);

// maxium traces to join
const maxTracesToJoin = 20_000_000;
const maxTracesWindowSizeForEstimation = hours.toMillis(3);

export interface AdjustedTimeConfig extends TimeConfig {
  reduced: boolean;
  whyReduce?: 'duration-too-long' | 'too-many-calls';
}

interface UseImpactedUsersMetricsProps {
  impacted: { timeConfig: TimeConfig; joinFilterExpression: TagFilterExpressionElementUnion };
  total?: { timeConfig: TimeConfig; joinFilterExpression?: TagFilterExpressionElementUnion | null } | null;
}

export interface ExpandedFetchedState<T> {
  data?: T;
  state: FetchStatus;
  errors: Array<Error>;
  progress: Progress;
}

export interface ImpactedUsersMetricsResult {
  timeForTraceEstimation?: TimeConfig;
  traceEstimation?: ExpandedFetchedState<Array<UnifiedMetricsResult>>;
  adjustedTimeConfig?: AdjustedTimeConfig | null;
  impacted?: ExpandedFetchedState<Array<UnifiedMetricsResult>> | null;
  total?: ExpandedFetchedState<Array<UnifiedMetricsResult>> | null;
  websitesOrMobiles?: ExpandedFetchedState<CursorPaginatedResult<EumBeaconByTraceBeaconsItem>> | null;
}

export function useImpactedUsersMetrics({ impacted, total }: UseImpactedUsersMetricsProps): ImpactedUsersMetricsResult {
  const timeForTraceEstimation = adjustTimeConfigForTraceEstimation(
    total?.joinFilterExpression ? total.timeConfig : impacted.timeConfig
  );

  return (
    useObservable(() => {
      return getUnifiedMetrics({
        metrics: {
          traces: makeTotalTracesQuery(
            timeForTraceEstimation,
            total?.joinFilterExpression || impacted.joinFilterExpression
          )
        }
      }).flatMap(totalTraces => {
        const zeroResult: Result<Array<UnifiedMetricsResult>> = success<Array<UnifiedMetricsResult>>([
          { id: '', values: [[0]] }
        ]);

        if (!totalTraces?.progress || totalTraces.progress.loading) {
          return just(
            expandResults({
              timeForTraceEstimation: timeForTraceEstimation,
              traceEstimation: totalTraces,
              impacted: pendingResult,
              total: pendingResult,
              websitesOrMobiles: pendingResult
            })
          );
        }

        if (totalTraces.errors?.length) {
          return just(
            expandResults({
              timeForTraceEstimation: timeForTraceEstimation,
              traceEstimation: totalTraces,
              impacted: null,
              total: null
            })
          );
        }

        const totalTracesValue = totalTraces.data?.[0]?.values?.[0]?.[1] ?? 0;
        if (!totalTracesValue) {
          return just(
            expandResults({
              timeForTraceEstimation: timeForTraceEstimation,
              traceEstimation: totalTraces,
              impacted: zeroResult,
              total: zeroResult
            })
          );
        }

        const adjustedTimeConfig = adjustTimeConfigBasedOnTraceCount(
          impacted.timeConfig,
          totalTracesValue,
          timeForTraceEstimation
        );

        const impactedUsersObservable = getUnifiedMetrics({
          metrics: {
            impactedUsers: makeEumMetricConfiguration(adjustedTimeConfig, impacted.joinFilterExpression)
          }
        });
        const totalUsersObservable = total?.joinFilterExpression
          ? getUnifiedMetrics({
              metrics: {
                totalUsers: makeEumMetricConfiguration(adjustedTimeConfig, total.joinFilterExpression)
              }
            })
          : alwaysNull;
        const websitesOrMobilesObservable = getEumBeaconByTrace(
          makeEumBeaconByTraceQuery({
            metrics: ['beaconByTrace.configId', 'beaconByTrace.source'],
            timeConfig: adjustedTimeConfig,
            joinFilterExpression: impacted.joinFilterExpression,
            distinctBy: 'beaconByTrace.configId'
          })
        );

        return combineLatest([impactedUsersObservable, totalUsersObservable, websitesOrMobilesObservable]).map(
          ([resultImpacted, resultTotal, resultWebsitesOrMobiles]) =>
            expandResults({
              timeForTraceEstimation: timeForTraceEstimation,
              traceEstimation: totalTraces,
              adjustedTimeConfig: adjustedTimeConfig,
              impacted: resultImpacted,
              total: resultTotal,
              websitesOrMobiles: resultWebsitesOrMobiles
            })
        );
      });
    }, [impacted, total]) ?? {
      timeForTraceEstimation: timeForTraceEstimation,
      traceEstimation: expandFetchedState(resultToFetchedStateResponse(pendingResult)),
      adjustedTimeConfig: null,
      impacted: null,
      total: null,
      websitesOrMobiles: null
    }
  );
}

export type OverallStatusType = {
  errors: Error[];
  progress: {
    loading: boolean;
    percentage?: number;
  };
  pending: boolean;
  adjustedTimeConfig?: AdjustedTimeConfig | null;
  timeForTraceEstimation?: TimeConfig;
  traceEstimation: {
    hasData: boolean;
    value: number;
  };
  impacted: {
    hasData: boolean;
    value: number;
  };
  total: {
    hasData: boolean;
    value: number;
  };
};

export function calculateOverallStatus({
  adjustedTimeConfig,
  timeForTraceEstimation,
  traceEstimation,
  impacted,
  total,
  websitesOrMobiles
}: ImpactedUsersMetricsResult): OverallStatusType {
  const errors: Array<Error> = [];

  if (traceEstimation?.errors) {
    errors.push(...traceEstimation.errors);
  }
  if (impacted?.errors) {
    errors.push(...impacted.errors);
  }
  if (total?.errors) {
    errors.push(...total.errors);
  }
  if (websitesOrMobiles?.errors) {
    errors.push(...websitesOrMobiles.errors);
  }

  const percentage =
    normalizeProgress(traceEstimation?.progress) +
    normalizeProgress(impacted?.progress) +
    normalizeProgress(total?.progress) +
    normalizeProgress(websitesOrMobiles?.progress);

  return {
    errors,
    progress: {
      loading: Boolean(
        traceEstimation?.progress?.loading ||
          impacted?.progress?.loading ||
          total?.progress?.loading ||
          websitesOrMobiles?.progress?.loading
      ),
      percentage: percentage ? (percentage * 100) / 4 : undefined
    },
    pending: !!(
      traceEstimation?.state === 'pending' ||
      impacted?.state === 'pending' ||
      total?.state === 'pending' ||
      websitesOrMobiles?.state === 'pending'
    ),
    adjustedTimeConfig: adjustedTimeConfig,
    timeForTraceEstimation: timeForTraceEstimation,
    traceEstimation: getFirstValueFromUnifiedMetric(traceEstimation),
    impacted: getFirstValueFromUnifiedMetric(impacted),
    total: getFirstValueFromUnifiedMetric(total)
  };
}

function normalizeProgress(progress?: Progress) {
  if (!progress || progress.loading) {
    return progress?.percentage ?? 0;
  }

  return 1;
}

function getFirstValueFromUnifiedMetric(result?: ExpandedFetchedState<Array<UnifiedMetricsResult>> | null) {
  if (result?.state === 'pending' || !result?.data?.[0]?.values?.[0]?.length) {
    return { hasData: false, value: 0 };
  }

  return { hasData: true, value: result.data[0].values[0][1] ?? 0 };
}

function expandResults(result: {
  timeForTraceEstimation: TimeConfig;
  traceEstimation?: Result<Array<UnifiedMetricsResult>>;
  adjustedTimeConfig?: AdjustedTimeConfig;
  impacted?: Result<Array<UnifiedMetricsResult>> | null;
  total?: Result<Array<UnifiedMetricsResult>> | null;
  websitesOrMobiles?: Result<CursorPaginatedResult<EumBeaconByTraceBeaconsItem>> | null;
}): ImpactedUsersMetricsResult {
  return {
    timeForTraceEstimation: result?.timeForTraceEstimation,
    traceEstimation: expandFetchedState(resultToFetchedStateResponse(result?.traceEstimation ?? pendingResult)),
    adjustedTimeConfig: result?.adjustedTimeConfig,
    impacted: result?.impacted ? expandFetchedState(resultToFetchedStateResponse(result.impacted)) : null,
    total: result?.total ? expandFetchedState(resultToFetchedStateResponse(result.total)) : null,
    websitesOrMobiles: result?.websitesOrMobiles
      ? expandFetchedState(resultToFetchedStateResponse(result.websitesOrMobiles))
      : null
  };
}

function adjustTimeConfigBasedOnTraceCount(
  timeConfig: TimeConfig,
  traceEstimation: number,
  timeForTraceEstimation: TimeConfig
): AdjustedTimeConfig {
  let newWindowSize = timeConfig.windowSize;
  if (newWindowSize <= minImpactedUserWindowSizeForEstimation) {
    return { ...timeConfig, reduced: false };
  }

  let reason: AdjustedTimeConfig['whyReduce'] = undefined;
  if ((traceEstimation / timeForTraceEstimation.windowSize) * timeConfig.windowSize > maxTracesToJoin) {
    newWindowSize = Math.round((maxTracesToJoin * timeForTraceEstimation.windowSize) / traceEstimation);
    newWindowSize = (Math.floor(newWindowSize / hours.toMillis(1)) || 1) * hours.toMillis(1);
    reason = 'too-many-calls';
  }

  if (newWindowSize > maxImpactedUserWindowSize) {
    newWindowSize = maxImpactedUserWindowSize;
    reason = 'duration-too-long';
  }

  return {
    ...timeConfig,
    windowSize: newWindowSize,
    reduced: newWindowSize !== timeConfig.windowSize,
    whyReduce: reason
  };
}

export function estimateTotalCount(
  referenceTimeConfig: TimeConfig,
  referenceNumber: number,
  targetTimeConfig: TimeConfig
): number {
  if (referenceTimeConfig.windowSize === targetTimeConfig.windowSize) {
    return referenceNumber;
  }

  return Math.round((referenceNumber / referenceTimeConfig.windowSize) * targetTimeConfig.windowSize);
}

function adjustTimeConfigForTraceEstimation(input: TimeConfig): TimeConfig {
  return { ...input, windowSize: Math.min(input.windowSize, maxTracesWindowSizeForEstimation) };
}

function expandFetchedState<T>(fetchedState: FetchedState<T>): ExpandedFetchedState<T> {
  const [data, state, errors, progress] = fetchedState;
  return {
    data,
    state,
    errors,
    progress
  };
}

function makeEumMetricConfiguration(
  timeConfig: TimeConfig,
  joinFilterExpression: TagFilterExpressionElementUnion
): EumMetricConfiguration {
  return {
    source: 'EUM',
    aggregation: 'DISTINCT_COUNT',
    metric: 'uniqueUsersOrSessions',
    timeShift: { offset: 0 },
    timeConfig,
    resultType: 'SINGLE_NUMBER',
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    },
    join: [
      {
        source: 'JOIN_SOURCE_APPLICATION',
        type: 'JOIN_TYPE_IN',
        metric: 'beaconByTrace.truncatedBackendTraceId',
        tagFilterExpression: joinFilterExpression
      }
    ]
  };
}

function makeTotalTracesQuery(
  timeConfig: TimeConfig,
  tagFilterExpression: TagFilterExpressionElementUnion
): ApplicationMetricConfiguration {
  return {
    resultType: 'SINGLE_NUMBER',
    timeConfig: timeConfig,
    dataSource: 'TRACES',
    includeInternal: false,
    includeSynthetic: false,
    source: 'APPLICATION',
    tagFilterExpression: tagFilterExpression,
    metric: 'calls',
    aggregation: 'SUM',
    queryPrecision: 'FULL',
    timeShift: { offset: 0 }
  };
}
