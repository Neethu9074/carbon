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
  CursorPaginatedResult,
  APImpactedUsersByWebsiteOrAppResultItem,
  JoinSource,
  MobileAppMetricConfiguration,
  WebsiteMetricConfiguration,
  EumImpactedBeaconMetricConfiguration
} from '@instana/types';
import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getAPImpactedUsersByWebsiteOrApp, {
  makeAPImpactedUsersByWebsiteOrAppQuery
} from 'in-eum/subscriptions/getAPImpactedUsersByWebsiteOrApp';
// eslint-disable-next-line no-restricted-imports
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
// @ts-ignore
import * as entityUtils from 'in-services/entityUtils';
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
  websitesOrMobiles?: ExpandedFetchedState<CursorPaginatedResult<APImpactedUsersByWebsiteOrAppResultItem>> | null;
}

export function useImpactedUsersMetrics(
  { impacted, total }: UseImpactedUsersMetricsProps,
  alertType: string | undefined,
  entityType: string | unknown
): ImpactedUsersMetricsResult {
  const timeForTraceEstimation = adjustTimeConfigForTraceEstimation(
    total?.joinFilterExpression ? total.timeConfig : impacted.timeConfig
  );

  return (
    useObservable(() => {
      const [impactedUsersJoinConfig, totalUsersJoinConfig] = [
        'beaconByTrace.truncatedBackendTraceId',
        'beaconByTrace.configId'
      ];
      // LET US TRY AND RUN THE FOURTH QUERY HERE
      if (alertType === 'throughput' && entityUtils.isApplicationEntity(entityType)) {
        return impactedUsersLegacyQueries({ impacted, total }, timeForTraceEstimation);
      }
      let impactedUsersObservable;
      let totalUsersObservable;
      if (
        alertType === 'throughput' &&
        (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType))
      ) {
        impactedUsersObservable = usersReportforWebsiteOrMobile({ impacted, total }, entityType);
        totalUsersObservable = just(success<UnifiedMetricsResult[]>([]));
      } else {
        impactedUsersObservable = getImpactedUsersObservable(impacted, impactedUsersJoinConfig, entityType);
        totalUsersObservable = getTotalUsersObservable({ impacted, total }, totalUsersJoinConfig, entityType);
      }

      const APImpactedUsersByWebsiteOrAppObservable = entityUtils.isApplicationEntity(entityType)
        ? getAPImpactedUsersByWebsiteOrApp(
            makeAPImpactedUsersByWebsiteOrAppQuery({
              timeConfig: impacted.timeConfig,
              joinFilterExpression: impacted.joinFilterExpression,
              joinSource: 'JOIN_SOURCE_EUM_IMPACTED_TRACES'
            })
          )
        : just(
            success<CursorPaginatedResult<APImpactedUsersByWebsiteOrAppResultItem>>({
              items: [],
              canLoadMore: false,
              totalHits: 0,
              totalRepresentedItemCount: 0,
              totalRetainedItemCount: 0
            })
          );

      return combineLatest([
        impactedUsersObservable,
        totalUsersObservable,
        APImpactedUsersByWebsiteOrAppObservable
      ]).map(([resultImpacted, resultTotal, resultAPImpacted]) =>
        expandResults({
          timeForTraceEstimation: timeForTraceEstimation,
          adjustedTimeConfig: undefined,
          impacted: resultImpacted,
          total: resultTotal,
          websitesOrMobiles: resultAPImpacted
        })
      );
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

function getTotalUsersObservable(
  { impacted, total }: UseImpactedUsersMetricsProps,
  totalUsersJoinConfig: string,
  entityType: string | unknown
) {
  if (entityUtils.isWebsiteEntityType(entityType)) {
    return getUnifiedMetrics({
      metrics: {
        totalUsers: makeImpactedBeaconConfiguration(
          'WEBSITE',
          impacted.timeConfig,
          total?.joinFilterExpression || undefined
        )
      }
    });
  } else if (entityUtils.isMobileAppEntityType(entityType)) {
    return getUnifiedMetrics({
      metrics: {
        totalUsers: makeImpactedBeaconConfiguration(
          'MOBILE_APP',
          impacted.timeConfig,
          total?.joinFilterExpression || undefined
        )
      }
    });
  } else {
    return total?.joinFilterExpression
      ? getUnifiedMetrics({
          metrics: {
            totalUsers: makeEumMetricConfiguration(
              total.timeConfig,
              total.joinFilterExpression,
              totalUsersJoinConfig,
              'JOIN_SOURCE_EUM_IMPACTED_TRACES'
            )
          }
        })
      : alwaysNull;
  }
}

function getImpactedUsersObservable(
  impacted: UseImpactedUsersMetricsProps['impacted'],
  impactedUsersJoinConfig: string,
  entityType: string | unknown
) {
  if (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType)) {
    return getUnifiedMetrics({
      metrics: {
        impactedUsers: makeImpactedBeaconConfiguration(
          'EUM_IMPACTED_BEACON',
          impacted.timeConfig,
          impacted.joinFilterExpression
        )
      }
    });
  } else {
    return getUnifiedMetrics({
      metrics: {
        impactedUsers: makeEumMetricConfiguration(
          impacted.timeConfig,
          impacted.joinFilterExpression,
          impactedUsersJoinConfig,
          'JOIN_SOURCE_EUM_IMPACTED_TRACES'
        )
      }
    });
  }
}

function usersReportforWebsiteOrMobile(
  { impacted, total }: UseImpactedUsersMetricsProps,
  entityType: string | unknown
) {
  if (entityUtils.isWebsiteEntityType(entityType)) {
    return getUnifiedMetrics({
      metrics: {
        impactedUsers: makeImpactedBeaconConfiguration(
          'WEBSITE',
          impacted.timeConfig,
          total?.joinFilterExpression || undefined
        )
      }
    });
  } else {
    return getUnifiedMetrics({
      metrics: {
        impactedUsers: makeImpactedBeaconConfiguration(
          'MOBILE_APP',
          impacted.timeConfig,
          total?.joinFilterExpression || undefined
        )
      }
    });
  }
}

function impactedUsersLegacyQueries(
  { impacted, total }: UseImpactedUsersMetricsProps,
  timeForTraceEstimation: TimeConfig
) {
  return getUnifiedMetrics({
    metrics: {
      traces: makeTotalTracesQuery(timeForTraceEstimation, total?.joinFilterExpression || impacted.joinFilterExpression)
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
        impactedUsers: makeEumMetricConfiguration(
          adjustedTimeConfig,
          impacted.joinFilterExpression,
          'beaconByTrace.truncatedBackendTraceId',
          'JOIN_SOURCE_APPLICATION'
        )
      }
    });
    const totalUsersObservable = total?.joinFilterExpression
      ? getUnifiedMetrics({
          metrics: {
            totalUsers: makeEumMetricConfiguration(
              adjustedTimeConfig,
              total.joinFilterExpression,
              'beaconByTrace.truncatedBackendTraceId',
              'JOIN_SOURCE_APPLICATION'
            )
          }
        })
      : alwaysNull;
    const APImpactedUsersByWebsiteOrAppObservable = getAPImpactedUsersByWebsiteOrApp(
      makeAPImpactedUsersByWebsiteOrAppQuery({
        timeConfig: impacted.timeConfig,
        joinFilterExpression: impacted.joinFilterExpression,
        joinSource: 'JOIN_SOURCE_APPLICATION'
      })
    );

    return combineLatest([impactedUsersObservable, totalUsersObservable, APImpactedUsersByWebsiteOrAppObservable]).map(
      ([resultImpacted, resultTotal, resultAPImpacted]) =>
        expandResults({
          timeForTraceEstimation: timeForTraceEstimation,
          traceEstimation: totalTraces,
          adjustedTimeConfig: adjustedTimeConfig,
          impacted: resultImpacted,
          total: resultTotal,
          websitesOrMobiles: resultAPImpacted
        })
    );
  });
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
  traceEstimation?: {
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
  impacted,
  total,
  websitesOrMobiles
}: ImpactedUsersMetricsResult): OverallStatusType {
  const errors: Array<Error> = [];

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
    normalizeProgress(impacted?.progress) +
    normalizeProgress(total?.progress) +
    normalizeProgress(websitesOrMobiles?.progress);

  return {
    errors,
    progress: {
      loading: Boolean(impacted?.progress?.loading || total?.progress?.loading || websitesOrMobiles?.progress?.loading),
      percentage: percentage ? (percentage * 100) / 3 : undefined
    },
    pending: !!(impacted?.state === 'pending' || total?.state === 'pending' || websitesOrMobiles?.state === 'pending'),
    adjustedTimeConfig: adjustedTimeConfig,
    timeForTraceEstimation: timeForTraceEstimation,
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
  websitesOrMobiles?: Result<CursorPaginatedResult<APImpactedUsersByWebsiteOrAppResultItem>> | null;
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

function makeImpactedBeaconConfiguration(
  source: 'EUM_IMPACTED_BEACON' | 'EUM' | 'WEBSITE' | 'MOBILE_APP',
  timeConfig: TimeConfig,
  tagFilterExpression: TagFilterExpressionElementUnion | undefined
):
  | MobileAppMetricConfiguration
  | EumMetricConfiguration
  | WebsiteMetricConfiguration
  | EumImpactedBeaconMetricConfiguration {
  return {
    source: source,
    aggregation: 'DISTINCT_COUNT',
    metric: 'uniqueUsersOrSessions',
    timeShift: { offset: 0 },
    timeConfig,
    resultType: 'SINGLE_NUMBER',
    tagFilterExpression: tagFilterExpression,
    beaconType: 'ALL'
  };
}

function makeEumMetricConfiguration(
  timeConfig: TimeConfig,
  joinFilterExpression: TagFilterExpressionElementUnion,
  joinConfig: string,
  joinSource: JoinSource
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
        source: joinSource,
        type: 'JOIN_TYPE_IN',
        metric: joinConfig,
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
