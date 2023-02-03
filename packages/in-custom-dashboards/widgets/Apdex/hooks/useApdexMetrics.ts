/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MetricResult, Result, TimeConfig, GetUnifiedMetricsQuery } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';
import { minutes } from 'in-services/time';

interface UseApdexMetricsProps {
  id: string;
  timeConfig: TimeConfig;
  isPreview?: boolean;
}

function getQuery({ id, timeConfig, isPreview = false }: UseApdexMetricsProps): GetUnifiedMetricsQuery {
  return {
    metrics: {
      apdex: {
        apdexId: id,
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'APDEX',
        timeConfig,
        resultType: 'TIME_SERIES',
        isPreview,
        metric: 'APDEX',
        granularity: minutes.toMillis(1) // This is here to make backend validation happy, it will be ignored and the backend will supply they granularity
      }
    }
  };
}

export default function useApdexMetrics({
  id,
  timeConfig,
  isPreview
}: UseApdexMetricsProps): FetchedState<MetricResult[]> {
  const result: Result<MetricResult[]> =
    useObservable(() => {
      if (isBlank(id)) {
        return just(error([{ code: 'CLIENT', message: 'id cannot be blank' }]));
      }

      const query = getQuery({ id, timeConfig, isPreview });
      return getUnifiedMetrics(query);
    }, [id, timeConfig, isPreview]) ?? pendingResult;
  return resultToFetchedStateResponse(result);
}
