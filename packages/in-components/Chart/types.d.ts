/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DateFormatterInput, DateFormatterOutput } from '@instana/format-date';
import { Observable } from '@instana/observables';

import { AggregationType, FilterInterface, TimeConfig } from 'in-types';
import { Renderer } from 'in-components/Chart/renderer/types';
import { TimeShiftOffset } from 'in-stores/time/shifting';
import { FormatterFn } from 'in-stores/metric/formatters';

export interface MetricsConfiguration {
  reverseOrder?: boolean;
  filter?: FilterInterface;
  metrics: MetricMap;
}

export type MetricMap = { [id: string]: Metric };
export interface Metric {
  metric: string;
  timeShift?: TimeShiftOffset | TimeShift;
  aggregation?: AggregationType;
}

export interface ContextMenuButton {
  name: string;
  icon: string;
  label: string;
  getHref$: (tc: TimeConfig) => Observable<string> | undefined;
  allowClickPropagationAndDefault?: boolean;
  onClick?: () => void;
}

interface ResultAwareChartConfig {
  frontBufferWidth?: number;
  customHeight?: number;
  showNoDataInfoWhenEmpty?: boolean;
  renderErrorDetail?: boolean;
  renderHistoricDataIndicator?: boolean;
  hasApproximateData?: boolean;
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
}

interface LegendConfig {
  reverseLegendOrder?: boolean;
}

interface TooltopConfig {
  reverseTooltipOrder?: boolean;
  tooltipTimeFormatter?: (input: DateFormatterInput) => DateFormatterOutput;
}

interface ContextMenuConfig {
  primaryContextMenuAction?: string;
  additionalContextMenuButtons?: ContextMenuButton[];
  excludedContextMenuActions?: string[];
}

interface ChartConfig {
  y1?: Axis;
  y2?: Axis;
  granularity?: number;
  metricsConfiguration?: MetricsConfiguration;
  withoutPadding?: boolean;

  getAllDomainValues?: () => number[];
  shareMaxAxisDomain?: boolean;
}

export type Config = ResultAwareChartConfig &
  CardConfig &
  ChartReactComponentConfig &
  LegendConfig &
  TooltopConfig &
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

export type MetricDataSeries = [number, number][];

type AxisColor = string | null;
export interface Axis {
  renderer: Renderer;
  metrics: MetricDataSeries[];
  timeShifts?: TimeShift[] | null;
  metricIds: string[];
  labels: string[];
  colors: AxisColor[];
  icons?: AxisIcons;
  formatter?: Formatter;
  isStaticBudget?: boolean;
  lineWidth?: number;
  min?: number;
  max?: number;

  aggregations?: (AggregationType | undefined)[];
  defaultDisabledMetrics?: (string | null)[];
  tooltipFormatter?: Formatter;
  calculateStackDifferences?: boolean;
  excludedLabelsFromTooltip?: string[];
}

export type ChartContentPostition = 'pre' | 'post';

export interface AdditionChartContentProps {
  timeConfig: TimeConfig;
  granularity?: number;
  chartBucketWidth?: number;
  chartWidth?: number;
  chartHeight?: number;
  timeAxisHeight?: number;
  markerPaneHeight?: number;
  chartContentPosition: ChartContentPostition;
}
