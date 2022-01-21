/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { RenderProps } from 'in-components/Chart/renderer/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import { TimeConfig } from 'in-types';

export interface MetricsConfiguration {
  reverseOrder?: boolean;
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

export interface Axis {
  renderer: Renderer;
  metrics: [number, number][][];
  timeShifts?: TimeShift[] | null;
  metricIds: string[];
  labels: string[];
  colors: sting[];
  icons?: AxisIcons;
  formatter?: Formatter;

  // Sometimes use–case specific props are added to the Axis
  [key: string]: unknown;
}
