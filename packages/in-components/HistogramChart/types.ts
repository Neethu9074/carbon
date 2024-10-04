/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, MetricResult } from '@instana/types';

import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { HistogramConfig } from 'in-custom-dashboards/widgets/Histogram/form';

interface MenuItem {
  name: string;
  icon: string;
  label: string;
  onClick: () => void;
}

export interface ChartProps {
  height?: number;
  width?: number;
  customWidth?: number;
  customHeight?: number;
  config?: HistogramConfig;
  showLegend?: boolean;
  selectionAdjustable?: boolean;
  selectionMenuItems?: MenuItem[];
  onSelectionChanged?: (bucket: Bucket) => void;
  selection?: Bucket;
  result?: Result<MetricResult[]>;
  renderWidgetNotSupportedIndicator?: boolean;
  tooltipRef?: (tooltip: HTMLElement) => void;
}
