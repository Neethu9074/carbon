/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  MetricResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { combineLatest } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { finishedProgress } from 'in-services/fixedObjects';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';
import { hours } from 'in-services/time/time';

export interface SloMetricsResult {
  status: MetricResult;
  remainingBudget: MetricResult;
  remainingBudgetSpark: MetricResult;
}
export type SloMetricsResultMap = Record<string, SloMetricsResult>;
const MetricResultIdMatcher = /(?<sloId>.*)-(?<metricType>(status)|(remainingBudget)|(remainingBudgetSpark))$/;

export default function useSloListMetrics(
  configurations: ServiceLevelObjectiveConfiguration[]
): FetchedState<Record<string, SloMetricsResultMap>> {
  const configsHash = generateStableHash(configurations.map(c => c.id));

  const results = useObservable(
    () =>
      combineLatest(
        configurations.map(sloConfig =>
          getUnifiedMetrics({ metrics: getMetricConfig(sloConfig) }).map(structureMetricsResults(sloConfig.id!))
        )
      ),

    [configsHash]
  );
  const combinedResult = resultReducer(results);
  return resultToFetchedStateResponse(combinedResult);
}

export function resultReducer(
  results?: Result<StructuredMetricResult>[] | null
): Result<Record<string, SloMetricsResultMap>> | undefined {
  return results?.reduce(
    (acc, result) => {
      const loading = result.progress.loading || acc.progress.loading;
      const progress = { loading };
      if (!result.data) return { ...acc, progress };
      return {
        progress,
        errors: [],
        data: {
          ...acc.data,
          [result.data.sloId]: result.data.metrics
        }
      };
    },
    { progress: finishedProgress } as Result<Record<string, SloMetricsResultMap>>
  );
}

function getMetricConfig(
  configuration: ServiceLevelObjectiveConfiguration
): Record<string, UnifiedMetricConfigurationUnion> {
  // For slo list make sure we always fetch the latest metrics(for past hour)
  const timeConfig: TimeConfig = { autoRefresh: false, windowSize: hours.toMillis(1) };

  return {
    [`${configuration.id}-status`]: sloMetrics.status.singleNumber({
      configId: configuration.id!,
      timeConfig
    }),
    [`${configuration.id}-remainingBudget`]: sloMetrics.remainingBudget.singleNumber({
      configId: configuration.id!,
      timeConfig
    }),
    [`${configuration.id}-remainingBudgetSpark`]: sloMetrics.remainingBudget.timeSeriesCompact({
      configId: configuration.id!,
      timeConfig: timeConfig
    })
  };
}

export interface StructuredMetricResult {
  sloId: string;
  metrics: SloMetricsResultMap;
}
function structureMetricsResults(sloId: string): (result: Result<MetricResult[]>) => Result<StructuredMetricResult> {
  return result => {
    if (!result.data) return result as unknown as Result<StructuredMetricResult>;

    const metrics = result.data.reduce<SloMetricsResultMap>((acc, metricResult) => {
      const matches = metricResult.id.match(MetricResultIdMatcher);

      const metricType = matches?.groups?.metricType as keyof SloMetricsResult;

      if (!metricType) return acc;

      const metricGroup = acc[sloId] ?? {};
      metricGroup[metricType] = metricResult;

      acc[sloId] = metricGroup;

      return acc;
    }, {});

    return {
      ...result,
      data: { metrics, sloId }
    };
  };
}
