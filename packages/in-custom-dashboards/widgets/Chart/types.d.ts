/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { Axis as ChartAxis, Config as ChartConfig, ContextMenuConfig, TimeShift } from 'in-components/Chart/types';
import { Grouping, ResultType, UnifiedMetricConfiguration } from 'in-types';
import { TimeShiftOffset } from 'in-stores/time/shifting';

export interface ConfigFromDataSeries {
  renderErrorDetail: boolean;
  suggestedNumberOfDataPoints: number;
  minGranularity: number;
}

interface Config extends ContextMenuConfig {
  y1: Axis;
  y2?: Axis;
  granularity?: number;
  reverseOrder?: boolean;
  type: ResultType;
}

type AxisParams = 'colors' | 'min' | 'max' | 'tooltipFormatter' | 'calculateStackDifferences';
type Axis = Partial<Pick<ChartAxis, AxisParams>> & {
  metrics: Metric[];
  formatter?: string;
  renderer?: string;
  colorMapper?: (id: string, label: string) => string | null;
};

type MetricParams = 'metric' | 'source' | 'aggregation';
type BaseMetric = Pick<UnifiedMetricConfiguration, MetricParams>;

interface Metric extends BaseMetric {
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
type BaseChartConfig = Omit<ChartConfig, OmittedChartConfigParams>;

interface UnifiedMetricsChartProps extends BaseChartConfig {
  config: Config;

  onApproximateDataChange?: (hasApproximateData: boolean) => void;
}

interface MetricData {
  [id: string]: [number, number][];
}
