/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { ChartedMetric } from 'in-components/AnalyzeView/StateManagement';
import { ChartConfig } from 'in-components/Chart/types';

export interface LogsDistributionChartSectionProps extends UngroupedViewProps {
  disableClose?: boolean;
  hideRenderer?: boolean;
  showHeader?: boolean;
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
  isDashboard?: boolean;
}

export interface ChartProps extends UngroupedViewProps {
  metric: ChartedMetric;
  rightHeaderContent?: any;
}
