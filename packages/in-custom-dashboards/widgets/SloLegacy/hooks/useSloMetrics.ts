/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useMemo } from 'react';

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  Result,
  AggregationType,
  MetricResult,
  MetricSource,
  ResultType,
  TimeConfig,
  TimeShift,
  UnifiedMetricConfigurationUnion
} from 'in-types';
import getUnifiedSloMetrics from 'in-custom-dashboards/widgets/SloLegacy/subscriptions/getUnifiedSloMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

interface MetricBaseConfig {
  sliConfigId: string;
  timeShift: TimeShift;
  slo: number;
  aggregation: AggregationType;
  source: MetricSource;
  timeConfig: TimeConfig;
  resultType: ResultType;
  isPreview?: boolean;
}

interface UnifiedMetricConfigurations {
  [index: string]: UnifiedMetricConfigurationUnion;
}

const getMetrics = (metricBaseConfig: MetricBaseConfig, granularity: number): UnifiedMetricConfigurations => {
  return {
    consumed: {
      ...metricBaseConfig,
      metric: 'CONSUMED_ERROR_BUDGET_CHART',
      granularity
    },
    sli: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'SLI'
    },
    spent: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_SPENT'
    },
    remaining: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_REMAINING'
    },
    budget: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'TOTAL_ERROR_BUDGET'
    },
    hourlyBudget: {
      ...metricBaseConfig,
      metric: 'HOURLY_ERROR_BUDGET_CHART',
      granularity
    }
  } as UnifiedMetricConfigurations;
};

interface UseSloMetricsProps {
  slo: number;
  sliId: string;
  timeConfig: TimeConfig;
  granularity: number;
  isPreview?: boolean;
}

export default function useSloMetrics({
  slo,
  sliId,
  timeConfig,
  granularity,
  isPreview
}: UseSloMetricsProps): FetchedState<MetricResult[]> {
  const metrics = useMemo(() => {
    const metricConfig: MetricBaseConfig = {
      sliConfigId: sliId,
      timeShift: { offset: 0 },
      slo,
      aggregation: 'MEAN', // a value must be sent to the backend - it has no meaning at all
      source: 'SLI',
      timeConfig,
      resultType: 'TIME_SERIES',
      isPreview
    };
    return getMetrics(metricConfig, granularity);
  }, [slo, sliId, timeConfig, granularity, isPreview]);

  const result = useObservable(() => loadMetrics(metrics, sliId), [metrics]) ?? pendingResult;
  return resultToFetchedStateResponse(result);
}

function loadMetrics(metrics: UnifiedMetricConfigurations, sliId: string): Observable<Result<MetricResult[]>> {
  if (isBlank(sliId)) {
    return just(error([{ code: 'CLIENT', message: 'sliId cannot be blank' }]));
  }

  return getUnifiedSloMetrics({ metrics });
}
