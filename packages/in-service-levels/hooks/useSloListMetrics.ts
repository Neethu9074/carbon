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
  UnifiedMetricConfiguration
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { hasError, isLoading } from 'in-services/util/result';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';
import { hours } from 'in-services/time/time';

export interface SloMetricsResult {
  status: MetricResult;
  remainingBudget: MetricResult;
  remainingBudgetSpark: MetricResult;
}

const MetricResultIdMatcher = /(?<sloId>.*)-(?<metricType>(status)|(remainingBudget)|(remainingBudgetSpark))$/;

export default function useSloListMetrics(
  configurations: ServiceLevelObjectiveConfiguration[],
  timeConfig: TimeConfig
): FetchedState<Record<string, SloMetricsResult>> {
  const configsHash = generateStableHash(configurations.map(c => c.id));
  const metricConfig = useMemo(
    () => getMetricConfig(configurations, timeConfig),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- configurations is included via the previously generated hash
    [configsHash, timeConfig]
  );
  const result = useObservable(
    () => getUnifiedMetrics({ metrics: metricConfig }).map(structureMetricsResults),
    [configsHash, timeConfig]
  );
  return resultToFetchedStateResponse(result);
}

function getMetricConfig(
  configurations: ServiceLevelObjectiveConfiguration[],
  selectedTimeConfig: TimeConfig
): Record<string, UnifiedMetricConfiguration> {
  return configurations.reduce<Record<string, UnifiedMetricConfiguration>>((metricConfig, sloConfig) => {
    // To make sure we only get a single time-window we need to limit the window-size to one hour for the metrics
    const timeConfig = { ...selectedTimeConfig, windowSize: hours.toMillis(1) };

    metricConfig[`${sloConfig.id}-status`] = sloMetrics.status.singleNumber({
      configId: sloConfig.id!,
      timeConfig
    });
    metricConfig[`${sloConfig.id}-remainingBudget`] = sloMetrics.remainingBudget.singleNumber({
      configId: sloConfig.id!,
      timeConfig
    });
    metricConfig[`${sloConfig.id}-remainingBudgetSpark`] = sloMetrics.remainingBudget.timeSeriesCompact({
      configId: sloConfig.id!,
      timeConfig
    });

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
