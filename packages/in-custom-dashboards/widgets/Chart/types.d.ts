/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { AxisConfiguration, ChartConfig, ContextMenuConfig, TimeShift } from 'in-components/Chart/types';
import { Grouping, ResultType, TimeConfig, UnifiedMetricConfigurationUnion } from 'in-types';
import { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import { Facets } from 'in-components/AnalyzeView/StateManagement';
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
  type: ResultType;
}

type AxisParams =
  | 'outlineForColor'
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
  formatterSelected?: boolean;
};

type MetricParams = 'metric' | 'source' | 'aggregation';
type BaseMetric = Pick<UnifiedMetricConfigurationUnion, MetricParams>;

export interface Metric extends BaseMetric {
  timeShift?: TimeShift | TimeShiftOffset;
  compareToTimeShifted?: boolean;
  color?: string;
  label?: string;
  metricLabel?: string;
  defaultDisabled?: boolean;
  grouping?: Grouping[];
  unit?: string;

  // other properties may be sent to the backend
  [k: string]: any;
}

type OmittedChartConfigParams = 'y1' | 'y2' | 'timeConfig';
type BaseChartConfig = Omit<ChartReactComponentProps, OmittedChartConfigParams>;

interface UnifiedMetricsChartProps extends BaseChartConfig {
  config: Config;
  timeConfig?: TimeConfig;
  snapshotId?: string;
  hasActionlane?: boolean;
  hasButtonInActionslane?: boolean;
  bulkRequest?: boolean;
  onApproximateDataChange?: (hasApproximateData: boolean) => void;
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
  facets?: Facets;
  formModel?: FormModelElement;
  tableOpen?: boolean;
  tableCloseHandler?: Function;
}

type MetricTimestamp = number;
type MetricValue = number;
export type MetricBucket = [MetricTimestamp, MetricValue];

export interface MetricData {
  [id: string]: MetricBucket[];
}
