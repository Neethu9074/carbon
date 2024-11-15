/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Property } from 'csstype';
import React from 'react';

import { AggregationType, BoundaryScope, FilterInterface, TimeConfig } from '@instana/types';
import { DateFormatterInput, DateFormatterOutput } from '@instana/format-date';
import { ThresholdOperator } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';

import { Renderer } from 'in-components/Chart/renderer/types';
import Configuration from 'in-components/Chart/Configuration';
import { TimeShiftOffset } from 'in-stores/time/shifting';
import { FormatterFn } from 'in-stores/metric/formatters';

export interface Chart {
  config: Configuration;
}

export interface MetricsConfiguration {
  reverseOrder?: boolean;
  filter?: FilterInterface;
  metrics: MetricMap;
  companionMetrics: MetricMap;
}

export type MetricMap = { [id: string]: Metric };

export interface Metric {
  metric: string;
  timeShift?: TimeShiftOffset | TimeShift;
  aggregation?: AggregationType;
  unit?: string;
  type?: string;
  pollRate?: number;
}

export interface ChartedMetricsConfig {
  renderedMetrics: string[];
  chartMetrics: Set<string>;
}

export type TimeConfigAwareHref$Creator = (tc: TimeConfig, c?: ChartedMetricsConfig) => Observable<string> | undefined;

export interface ContextMenuButton {
  name: string;
  icon: string;
  label: string;
  getHref$?: TimeConfigAwareHref$Creator;
  allowClickPropagationAndDefault?: boolean;
  onClick?: () => void;
}

interface ResultAwareChartConfig {
  frontBufferWidth?: number;
  backBufferWidth?: number;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  showNoDataInfoWhenEmpty?: boolean;
  renderErrorDetail?: boolean;
  renderHistoricDataIndicator?: boolean;
  renderWidgetNotSupportedIndicator?: boolean;
  hasApproximateData?: boolean;
  extraInfo?: string;
  disableChartInLive?: boolean;
  approximateTooltipText?: string;
}

interface CardConfig {
  title?: string;
  cardUseMaxAvailableHeight?: boolean;
  rightHeaderContent?: React.ReactElement;
}

interface ChartReactComponentConfig {
  timeConfig: TimeConfig;
  originalTimeConfig?: TimeConfig;
  renderPreChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  renderPostChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  nonInteractive?: boolean;
  automaticallySize?: boolean;
  renderLegend?: boolean;
  extendBar?: boolean;
}

interface LegendConfig {
  reverseLegendOrder?: boolean;
}

interface TooltipConfig {
  reverseTooltipOrder?: boolean;
  tooltipTimeFormatter?: (input: DateFormatterInput) => DateFormatterOutput;
}

export interface ContextMenuConfig {
  primaryContextMenuAction?: string;
  additionalContextMenuButtons?: ContextMenuButton[];
  excludedContextMenuActions?: string[];
}

export interface ChartConfig {
  y1: AxisConfiguration;
  y2?: AxisConfiguration;
  granularity?: number;
  metricsConfiguration?: MetricsConfiguration;
  companionMetricsConfiguration?: MetricsConfiguration;
  withoutPadding?: boolean;

  getAllDomainValues?: () => number[];
  shareMaxAxisDomain?: boolean;

  width: number;
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
}

export type Config = ResultAwareChartConfig &
  CardConfig &
  ChartReactComponentConfig &
  LegendConfig &
  TooltipConfig &
  ContextMenuConfig &
  ChartConfig;

interface TimeShift {
  offset: number;
}

export type FormatterObject = {
  detailed: FormatterFn;
  compact: FormatterFn;
};

interface Icon {
  types: string[];
  colors?: string[];
}

export type Formatter = FormatterObject | FormatterFn;

type AxisIcons = {
  colors?: string[];
  types: string[];
};

export type MetricDataPoint = [timeStamp: number, value: number];
export type MetricDataSeries = MetricDataPoint[];

type AxisColor = string | null;
export type AxisName = 'y1' | 'y2';

export type DatapointsDistancePerSeries = { [id: string]: number };

export interface AxisConfiguration {
  renderer: Renderer;
  metrics: MetricDataSeries[];
  timeShifts?: TimeShift[] | null;
  metricIds: string[];
  companionMetricIds?: string[];
  labels: string[];
  companionMetricLabels?: string[];
  colors: AxisColor[];
  icons?: AxisIcons;
  formatter?: Formatter | FormatterObject[];
  companionMetricFormatter?: Formatter | Formatter[];
  lineWidth?: number;
  min?: number;
  max?: number;
  getMax?: (maxValue: number) => number;

  aggregations?: (AggregationType | undefined)[];
  defaultDisabledMetrics?: (string | null)[];
  forceDisabledMetrics?: (string | null)[];
  tooltipFormatter?: Formatter;
  calculateStackDifferences?: boolean;
  excludedLabelsFromTooltip?: string[];
  // Labels that are filtered out from Legends
  excludedLabelsFromLegend?: string[];
  fixedTickPositions?: number[];
  renderAllTickLabels?: boolean;
  detailedFormatting?: boolean;

  outlineForColor?: { [k: string]: string };
  colors100?: Property.Color[];
  colors50?: Property.Color[];

  valuesDependOnEachOther?: boolean;
  valuesNeedToBeStacked?: boolean;

  maxDataPoints?: number;
  minPixelsPerBlock?: number;

  companionMetrics?: MetricDataSeries[];
  companionMetricConfigs?: CompanionMetricConfig[];

  lastValue?: boolean;
  distanceBetweenDatapointsInMillis?: DatapointsDistancePerSeries;
}

export type ChartContentPostition = 'pre' | 'post';

export interface AdditionChartContentProps {
  timeConfig: TimeConfig;
  granularity?: number;
  chartBucketWidth: number;
  chartWidth: number;
  chartHeight?: number;
  timeAxisHeight?: number;
  markerPaneHeight?: number;
  chartContentPosition: ChartContentPostition;
  boundaryScope?: BoundaryScope;
  chartName?: string;
  alertRules?: AlertRule;
}

interface AlertRule {
  throughputHigh: ThroughputHigh;
  throughputLow: ThroughputLow;
  errorCount: ErrorCount;
}

type Seasonality = 'DAILY' | 'WEEKLY';

interface ThroughputHigh {
  rule: Rule;
  seasonality?: Seasonality;
}

interface ThroughputLow {
  rule: Rule;
  seasonality?: Seasonality;
  operator?: ThresholdOperator;
}

interface ErrorCount {
  rule: Rule;
  seasonality?: Seasonality;
}

interface Rule {
  alertType: throughputBlueprintConfig.type;
  aggregation: AggregationType;
  metricName: string;
}

export interface Axis extends Omit<AxisConfiguration, 'colors100' | 'colors50' | 'colors' | 'formatter'> {
  minValue: number;
  maxValue: number;
  formatter: FormatterObject[];
  colors100: Property.Color[];
  colors50: Property.Color[];
  colors: Property.Color[];
  numOfSeries: number;
  dynamicCalculatedBlockSizeMillis?: number;
}
