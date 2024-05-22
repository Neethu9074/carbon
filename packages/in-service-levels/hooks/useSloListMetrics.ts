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
  UnifiedMetricConfiguration
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
export type SloMetricResult = Record<string, SloMetricsResult>;
const MetricResultIdMatcher = /(?<sloId>.*)-(?<metricType>(status)|(remainingBudget)|(remainingBudgetSpark))$/;

export default function useSloListMetrics(
  configurations: ServiceLevelObjectiveConfiguration[],
  timeConfig: TimeConfig
): FetchedState<Record<string, SloMetricResult>> {
  const configsHash = generateStableHash(configurations.map(c => c.id));

  const results = useObservable(
    () =>
      combineLatest(
        configurations.map(sloConfig =>
          getUnifiedMetrics({ metrics: getMetricConfig(sloConfig, timeConfig) }).map(
            structureMetricsResults(sloConfig.id!)
          )
        )
      ),

    [configsHash, timeConfig]
  );
  const combinedResult = results?.reduce(
    (acc, result) => {
      if (!result.data) return acc;
      const loading = result.progress.loading || acc.progress.loading;

      return {
        progress: { loading },
        errors: [],
        data: {
          ...acc.data,
          [result.data.sloId]: result.data.metrics
        }
      };
    },
    { progress: finishedProgress } as Result<Record<string, SloMetricResult>>
  );
  const fetchedResponse = resultToFetchedStateResponse(combinedResult);
  return fetchedResponse;
}

function getMetricConfig(
  configuration: ServiceLevelObjectiveConfiguration,
  selectedTimeConfig: TimeConfig
): Record<string, UnifiedMetricConfiguration> {
  // To make sure we only get a single time-window we need to limit the window-size to one hour for the metrics
  const timeConfig = { ...selectedTimeConfig, windowSize: hours.toMillis(1) };
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
      timeConfig: selectedTimeConfig
    })
  };
}

export interface StructuredMetricResult {
  sloId: string;
  metrics: SloMetricResult;
}
function structureMetricsResults(sloId: string): (result: Result<MetricResult[]>) => Result<StructuredMetricResult> {
  return result => {
    if (!result.data) return result as unknown as Result<StructuredMetricResult>;

    const metrics = result.data.reduce<SloMetricResult>((acc, metricResult) => {
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
