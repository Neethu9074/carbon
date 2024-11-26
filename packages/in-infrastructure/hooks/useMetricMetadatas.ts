/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { combineLatest } from '@instana/observables';
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
  queries,
  kpiDefinitions
}: {
  type: string;
  queries: string[];
  kpiDefinitions: KpiDefinition[];
}): Result<Metadatas> {
  const timeConfig = useTimeConfig();

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  } as TimeConfig;

  return (
    useObservable(
      () =>
        combineLatest(
          queries.map(query =>
            getAvailableMetrics({
              filter: {
                timeConfig: modifiedTimeConfig,
                tagFilterExpression: EMPTY_EXPRESSION
              },
              type,
              query
            }).map(result => mapData(result, data => data.metrics && data.metrics.find(metric => metric.id === query)))
          )
        ).map(availableMetrics => {
          const error = availableMetrics.find(result => hasError(result));

          if (error) {
            return error;
          }

          if (availableMetrics.some(result => isLoading(result))) {
            return pendingResult;
          }

          const kpis: Metadatas = kpiDefinitions
            .map(createMetadataFromKpi)
            .reduce((prev, cur) => ({ [cur.metric]: cur, ...prev }), {});

          return success(
            availableMetrics
              .filter(result => result.data)
              .map(result => result.data as MetricMetadata)
              .map(createMetadataFromBackend(kpis))
              .reduce((prev, cur) => ({ ...prev, [cur.metric]: cur }), kpis)
          );
        }),
      [timeConfig, type, queries.join('-')]
    ) ?? pendingResult
  );
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
  formatterType?: string;
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
      formatterType: metric.format,
      percentageMetric: metric.format === 'PERCENTAGE',
      formatter: getFormatter(metric.format as BackendFormatterType),
      crossSeriesAggregations: metric.crossSeriesAggregations
    } as Metadata;
  };
}
