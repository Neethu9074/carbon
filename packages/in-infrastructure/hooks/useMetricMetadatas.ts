/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { combineLatest, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { BackendFormatterType, getFormatter } from 'in-services/formatters/backendFormatter';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { hasError, isLoading, mapData, success } from 'in-services/util/result';
import { AggregationType, MetricMetadata, Result, TimeConfig } from 'in-types';
import { getFormatterType } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useMetricMetadatas({
  type,
  metrics,
  kpiDefinitions
}: {
  type: string;
  metrics: {
    metric: string;
    aggregation: string;
  }[];
  kpiDefinitions: KpiDefinition[];
}): Result<Metadatas> {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () =>
        combineLatest(metrics.map(metric => getMetricLabelObservable(timeConfig, type, metric.metric))).map(array => {
          const error = array.find(result => hasError(result));
          if (error) {
            return error;
          }
          if (array.some(result => isLoading(result))) {
            return pendingResult;
          }
          const kpis: Metadatas = kpiDefinitions
            .map(createMetadataFromKpi)
            .reduce((prev, cur) => ({ [cur.metric]: cur, ...prev }), {});
          return success(
            array
              .filter(result => result.data)
              .map(result => result.data as MetricMetadata)
              .map(createMetadataFromBackend(kpis))
              //prefer labels from getAvailableMetrics api than from ui-client metric registry
              .reduce((prev, cur) => ({ [cur.metric]: cur, ...prev }), kpis)
          );
        }),
      [timeConfig, type, metrics.join('-')]
    ) ?? pendingResult
  );
}

function getMetricLabelObservable(
  timeConfig: TimeConfig,
  type: string,
  metric: string
): Observable<Result<MetricMetadata | undefined>> {
  return getAvailableMetrics({
    filter: {
      timeConfig,
      tagFilterExpression: EMPTY_EXPRESSION
    },
    type,
    query: metric
  }).map(result => mapData(result, data => data.metrics && data.metrics.find(m => m.id === metric)));
}

function createMetadataFromKpi(kpiDefinition: KpiDefinition): Metadata {
  return {
    ...kpiDefinition,
    isKpi: true,
    percentageMetric: getFormatterType(kpiDefinition.formatter) === 'PERCENTAGE'
  };
}

export interface Metadata {
  metric: string;
  label: string;
  formatter: (num: number) => string;
  percentageMetric: boolean;
  isKpi?: boolean;
  crossSeriesAggregations?: AggregationType[];
}

export type Metadatas = { [metricId: string]: Metadata };

function createMetadataFromBackend(kpis: Metadatas): (metric: MetricMetadata) => Metadata {
  return metric => {
    return {
      label: metric.label,
      metric: metric.id,
      isKpi: Object.prototype.hasOwnProperty.call(kpis, metric.id as PropertyKey),
      percentageMetric: metric.format === 'PERCENTAGE',
      formatter: getFormatter(metric.format as BackendFormatterType),
      crossSeriesAggregations: metric.crossSeriesAggregations
    } as Metadata;
  };
}
