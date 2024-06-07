/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { EumMetricConfiguration, TagFilterExpressionElementUnion, TimeConfig, Error, Progress } from '@instana/types';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState, FetchStatus } from 'in-hooks/utils/types';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';

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
  impacted?: ExpandedFetchedState<Array<UnifiedMetricsResult>>;
  total?: ExpandedFetchedState<Array<UnifiedMetricsResult>> | null;
}

export function useImpactedUsersMetrics({ impacted, total }: UseImpactedUsersMetricsProps): ImpactedUsersMetricsResult {
  const result = useObservable(() => {
    const impactedUsers = getUnifiedMetrics({
      metrics: {
        impactedUsers: makeEumMetricConfiguration(impacted.timeConfig, impacted.joinFilterExpression)
      }
    });
    const totalUsers = total?.joinFilterExpression
      ? getUnifiedMetrics({
          metrics: {
            totalUsers: makeEumMetricConfiguration(total.timeConfig, total.joinFilterExpression)
          }
        })
      : alwaysNull;

    return combineLatest([impactedUsers, totalUsers]).map(([resultImpacted, resultTotal]) => ({
      impacted: resultImpacted,
      total: resultTotal
    }));
  }, [impacted, total]);

  const fetchState = useMemo(() => {
    return {
      impacted: expandFetchedState(resultToFetchedStateResponse(result?.impacted ?? pendingResult)),
      total: result?.total ? expandFetchedState(resultToFetchedStateResponse(result.total)) : null
    };
  }, [result]);
  return fetchState;
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
