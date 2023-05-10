/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import {
  MetricResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { useObservable } from '@instana/hooks';

import { calculateTimeConfigForSloTimeWindow } from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { hasError, isLoading } from 'in-services/util/result';
import { FetchedState } from 'in-hooks/utils/types';

export interface SloMetricsResult {
  status: MetricResult;
}

// This is including "budget" as an example for other metric types
const MetricResultIdMatcher = /(?<sloId>.*)-(?<metricType>(status)|(budget))$/;

export default function useSloListMetrics(
  configurations: ServiceLevelObjectiveConfiguration[],
  timeConfig: TimeConfig
): FetchedState<Record<string, SloMetricsResult>> {
  const metricConfig = useMemo(() => getMetricConfig(configurations, timeConfig), [configurations, timeConfig]);
  const result = useObservable(
    () => getUnifiedMetrics({ metrics: metricConfig }).map(structureMetricsResults),
    [configurations, timeConfig]
  );
  return resultToFetchedStateResponse(result);
}

function getMetricConfig(
  configurations: ServiceLevelObjectiveConfiguration[],
  timeConfig: TimeConfig
): Record<string, UnifiedMetricConfigurationUnion> {
  const baseConfig = {
    timeShift: { offset: 0 },
    aggregation: 'MEAN',
    source: 'SLO'
  };
  return configurations.reduce<Record<string, UnifiedMetricConfigurationUnion>>((metricConfig, sloConfig) => {
    // @ts-expect-error
    metricConfig[`${sloConfig.id}-status`] = {
      ...baseConfig,
      configId: sloConfig.id!,
      resultType: 'SINGLE_NUMBER',
      metric: 'SLI',
      timeConfig: calculateTimeConfigForSloTimeWindow(timeConfig, sloConfig.timeWindow)
    };
    return metricConfig;
  }, {});
}

function structureMetricsResults(result: Result<MetricResult[]>): Result<Record<string, SloMetricsResult>> {
  if (isLoading(result) || hasError(result)) {
    return result as unknown as Result<Record<string, SloMetricsResult>>;
  }

  const structuredResults = result.data!.reduce<Record<string, SloMetricsResult>>((acc, metricResult) => {
    const matches = metricResult.id.match(MetricResultIdMatcher);
    const sloId = matches?.groups?.sloId;
    const metricType = matches?.groups?.metricType as keyof SloMetricsResult;

    if (!sloId || !metricType) return acc;

    const metricGroup = acc[sloId] ?? {};
    metricGroup[metricType] = metricResult;
    acc[sloId] = metricGroup;

    return acc;
  }, {});

  return {
    ...result,
    data: structuredResults
  };
}
