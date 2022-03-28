/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

// eslint-disable-next-line no-restricted-imports
import { getResolvedTimeConfig, TimeResult } from 'in-applications/metrics';
import { AdditionChartContentProps, Config, ContextMenuButton, MetricDataSeries } from 'in-components/Chart/types';
import { PaginatedResult, Result, ServiceItem, TimeConfig } from 'in-types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import { MetricDefinition } from './AlternativeServicesChart';

export interface AlternativeServicesChartPresenterProps {
  result: Result<PaginatedResult<ServiceItem>>;
  metricDefinition: MetricDefinition;
  timeConfig: TimeConfig;
  cardTitle?: string;
  cardHeader?: ReactElement;
  translateLabel?: (value: string) => string;
  translateColor?: (value: string) => string;
  metricIds?: string[];
  primaryContextMenuAction?: string;
  additionalContextMenuButtons?: ContextMenuButton[];
  renderPostChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  renderHistoricDataIndicator?: boolean;
}

export default function AlternativeServicesChartPresenter({
  result,
  cardHeader,
  metricDefinition,
  timeConfig,
  cardTitle,
  translateLabel,
  translateColor,
  metricIds,
  primaryContextMenuAction,
  additionalContextMenuButtons,
  renderPostChartContent,
  renderHistoricDataIndicator
}: AlternativeServicesChartPresenterProps) {
  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  const chartConfig: Config = {
    cardTitle,
    cardHeader,
    granularity: getChartGranularity(timeConfig),
    primaryContextMenuAction,
    additionalContextMenuButtons,
    y1: {
      formatter: metricDefinition.formatter,
      renderer: metricDefinition.renderer,
      metrics: [],
      metricIds: [],
      labels: [],
      colors: []
    },
    renderPostChartContent,
    renderHistoricDataIndicator,
    hasApproximateData,
    timeConfig
  };

  const validItem = result?.data?.items?.find((item: ServiceItem) => item.metrics[metricDefinition.metric]);
  if (validItem) {
    if (!metricIds) {
      metricIds = result?.data?.items?.map((item: ServiceItem) => item.service.id) ?? [];
    }
    chartConfig.y1.metricIds = metricIds;

    chartConfig.timeConfig = getResolvedTimeConfig(timeConfig, result as TimeResult);
    chartConfig.y1.metrics = metricIds.map((id: string) => {
      const matchingItem = result?.data?.items?.find((item: ServiceItem) => item.service.id === id);
      if (matchingItem) {
        return matchingItem.metrics[metricDefinition.metric] as MetricDataSeries;
      }
      return metricDefinition.fallbackMetricValue ?? [];
    });

    chartConfig.y1.aggregations = metricIds.map(() => metricDefinition.aggregation);

    chartConfig.y1.labels = metricIds;
    if (translateLabel) {
      const translatedLabels = metricIds.map((id: string) => translateLabel(id));
      if (translatedLabels.every((item?: string | undefined) => item)) {
        chartConfig.y1.labels = translatedLabels;
      }
    }
    if (translateColor) {
      const colors = metricIds.map((label: string) => translateColor(label));
      if (colors.every((item: string | undefined) => item)) {
        chartConfig.y1.colors = colors;
      }
    }
  }

  return <ResultAwareChart result={result} config={(chartConfig as unknown) as Config} />;
}
