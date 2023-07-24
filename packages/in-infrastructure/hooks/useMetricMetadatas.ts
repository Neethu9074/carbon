/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { BackendFormatterType, getFormatter } from 'in-services/formatters/backendFormatter';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { AggregationType, MetricMetadata, Result } from 'in-types';
import { getFormatterType } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mapData } from 'in-services/util/result';

export default function useMetricMetadatas({
  type,
  kpiDefinitions,
  query
}: {
  type: string;
  kpiDefinitions: KpiDefinition[];
  query?: string;
}): Result<Metadatas> {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () =>
        getAvailableMetrics({
          filter: {
            timeConfig,
            tagFilterExpression: EMPTY_EXPRESSION
          },
          type,
          query
        })
        .map(result => mapData(result, availableMetrics => {
          if (!availableMetrics.metrics) {
            return [];
          }
          const kpis: Metadatas = Object.fromEntries(kpiDefinitions
            .map(createMetadataFromKpi)
            .map(kpi => [kpi.metric, kpi]));
          return Object.assign(kpis, Object.fromEntries(availableMetrics.metrics
            ?.map(createMetadataFromBackend(kpis))
            .map(metric => [metric.metric, metric])));
        })),
      [timeConfig, type]
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
