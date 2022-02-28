/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { RenderProps } from 'in-components/Chart/renderer/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import { FilterInterface, TimeConfig } from 'in-types';

export interface MetricsConfiguration {
  reverseOrder?: boolean;
  filter: FilterInterface;
}

export interface ContextMenuButton {
  name: string;
  icon: string;
  label: string;
  getHref$: () => void;
}

export interface Config {
  frontBufferWidth?: number;
  customHeight?: number;
  automaticallySize?: boolean;
  cardTitle?: string;
  leftHeaderContent?: React.ReactElement;
  rightHeaderContent?: React.ReactElement;
  cardHeader?: React.ReactElement;
  showNoDataInfoWhenEmpty?: boolean;

  timeConfig?: TimeConfig;
  y1: Axis;
  y2?: Axis;
  cardUseMaxAvailableHeight?: boolean;
  granularity: number;
  nonInteractive?: boolean;
  metricsConfiguration?: MetricsConfiguration;
  renderErrorDetail?: boolean;
  withoutPadding?: boolean;

  renderPreChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  renderPostChartContent?: (props: AdditionChartContentProps) => React.ReactNode;

  getAllDomainValues?: () => number[];
  renderHistoricDataIndicator?: boolean;
  hasApproximateData?: boolean;
}

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

export interface Renderer {
  id?: string;
  render?: (args: RenderProps) => void;
}

type AxisIcons = {
  colors?: string[];
  types: string[];
};

export type MetricDataSeries = [number, number][];

export interface Axis {
  renderer: Renderer;
  metrics: MetricDataSeries[];
  timeShifts?: TimeShift[] | null;
  metricIds: string[];
  labels: string[];
  colors: sting[];
  icons?: AxisIcons;
  formatter?: Formatter;

  // Sometimes use–case specific props are added to the Axis
  [key: string]: unknown;
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
