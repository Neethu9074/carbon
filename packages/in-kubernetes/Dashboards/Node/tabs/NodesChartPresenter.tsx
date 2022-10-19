/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { AxisColor, Formatter, TimeShift } from 'in-components/Chart/types';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { line } from 'in-stores/metric/renderer';
import theme from 'in-themes';

interface NodesChartPresenterProps {
  metrics: Metric[];
  title: string;
  colors: AxisColor[];
  formatter: string;
  tooltipFormatter?: Formatter;
  // following fields are passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectedMetricValue?: string;
  timeShiftConfig?: TimeShift;
  selectorComponent?: JSX.Element;
}

export default function NodesChartPresenter({
  metrics,
  title,
  colors,
  formatter,
  tooltipFormatter,
  selectedMetricValue,
  timeShiftConfig,
  selectorComponent
}: NodesChartPresenterProps) {
  const selectedMetric = metrics.find(m => m.metric === selectedMetricValue) ?? metrics[0];
  return (
    <UnifiedMetricsChart
      rightHeaderContent={selectorComponent}
      title={title}
      config={{
        y1: {
          metrics: timeShiftConfig?.offset
            ? [selectedMetric, { ...selectedMetric, timeShift: timeShiftConfig.offset }]
            : metrics,
          formatter,
          tooltipFormatter,
          colors: timeShiftConfig?.offset
            ? ([selectedMetric.color, theme.lib.colors.timeShift] as AxisColor[])
            : colors,
          renderer: line.id
        },
        reverseOrder: true,
        type: 'TIME_SERIES'
      }}
      renderPostChartContent={K8DashboardsMarkerLanes}
    />
  );
}
