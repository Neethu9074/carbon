/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { AxisConfiguration, ContextMenuConfig, TimeShift } from 'in-components/Chart/types';
import { Grouping, ResultType, TimeConfig, UnifiedMetricConfiguration } from 'in-types';
import { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import { TimeShiftOffset } from 'in-stores/time/shifting';

export interface ConfigFromDataSeries {
  renderErrorDetail: boolean;
  suggestedNumberOfDataPoints: number;
  minGranularity: number;
}

export interface Config extends ContextMenuConfig {
  y1: Axis;
  y2?: Axis;
  granularity?: number;
  reverseOrder?: boolean;
  outlineForColor?: string[];
  type: ResultType;
}

type AxisParams =
  | 'colors'
  | 'min'
  | 'max'
  | 'tooltipFormatter'
  | 'calculateStackDifferences'
  | 'companionMetrics'
  | 'companionMetricConfigs';
type Axis = Partial<Pick<AxisConfiguration, AxisParams>> & {
  metrics: Metric[];
  formatter?: string;
  renderer?: string;
  colorMapper?: (id: string, label: string) => string | null;
  reverseOrder?: boolean;
};

type MetricParams = 'metric' | 'source' | 'aggregation';
type BaseMetric = Pick<UnifiedMetricConfiguration, MetricParams>;

export interface Metric extends BaseMetric {
  timeShift?: TimeShift | TimeShiftOffset;
  compareToTimeShifted?: boolean;
  color?: string;
  label?: string;
  metricLabel?: string;
  defaultDisabled?: boolean;
  grouping?: Grouping[];

  // other properties may be sent to the backend
  [k: string]: any;
}

type OmittedChartConfigParams = 'y1' | 'y2' | 'timeConfig';
type BaseChartConfig = Omit<ChartReactComponentProps, OmittedChartConfigParams>;

interface UnifiedMetricsChartProps extends BaseChartConfig {
  config: Config;
  timeConfig?: TimeConfig;
  onApproximateDataChange?: (hasApproximateData: boolean) => void;
}

interface MetricData {
  [id: string]: [number, number][];
}
