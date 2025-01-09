/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

import { MetricDefinition } from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesChart';
import {
  AdditionChartContentProps,
  AxisConfiguration,
  ContextMenuButton,
  MetricDataSeries
} from 'in-components/Chart/types';
// eslint-disable-next-line no-restricted-imports
import { getResolvedTimeConfig, TimeResult } from 'in-applications/metrics';
import { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import { PaginatedResult, Result, ServiceItem, TimeConfig } from 'in-types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';

export interface AlternativeServicesChartPresenterProps {
  result: Result<PaginatedResult<ServiceItem>>;
  metricDefinition: MetricDefinition;
  timeConfig: TimeConfig;
  title?: string;
  rightHeaderContent?: ReactElement;
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
  rightHeaderContent,
  metricDefinition,
  timeConfig,
  title,
  translateLabel,
  translateColor,
  metricIds,
  primaryContextMenuAction,
  additionalContextMenuButtons,
  renderPostChartContent,
  renderHistoricDataIndicator
}: AlternativeServicesChartPresenterProps) {
  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  const y1: AxisConfiguration = {
    formatter: metricDefinition.formatter,
    renderer: metricDefinition.renderer,
    metrics: [],
    metricIds: [],
    labels: [],
    colors: []
  };

  const validItem = result?.data?.items?.find((item: ServiceItem) => item.metrics[metricDefinition.metric]);
  if (validItem) {
    if (!metricIds) {
      metricIds = result?.data?.items?.map((item: ServiceItem) => item.service.id) ?? [];
    }
    y1.metricIds = metricIds;

    timeConfig = getResolvedTimeConfig(timeConfig, result as TimeResult);
    y1.metrics = metricIds.map((id: string) => {
      const matchingItem = result?.data?.items?.find((item: ServiceItem) => item.service.id === id);
      if (matchingItem) {
        return matchingItem.metrics[metricDefinition.metric] as MetricDataSeries;
      }
      return metricDefinition.fallbackMetricValue ?? [];
    });

    y1.aggregations = metricIds.map(() => metricDefinition.aggregation);

    y1.labels = metricIds;
    if (translateLabel) {
      const translatedLabels = metricIds.map((id: string) => translateLabel(id));
      if (translatedLabels.every((item?: string | undefined) => item)) {
        y1.labels = translatedLabels;
      }
    }
    if (translateColor) {
      const colors = metricIds.map((label: string) => translateColor(label));
      if (colors.every((item: string | undefined) => item)) {
        y1.colors = colors;
      }
    }
  }

  const chartConfig: ChartReactComponentProps = {
    title,
    rightHeaderContent,
    granularity: getChartGranularity(timeConfig),
    primaryContextMenuAction,
    additionalContextMenuButtons,
    y1,
    renderPostChartContent,
    renderHistoricDataIndicator,
    hasApproximateData,
    timeConfig
  };

  return <ResultAwareChart result={result} config={chartConfig} />;
}
