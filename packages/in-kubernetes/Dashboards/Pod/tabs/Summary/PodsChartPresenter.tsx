/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { AxisColor, Formatter, TimeShift } from 'in-components/Chart/types';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { line } from 'in-stores/metric/renderer';
import theme from 'in-themes';

interface PodChartPresentProps {
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

export default function PodsChartPresenter({
  metrics,
  title,
  colors,
  formatter,
  tooltipFormatter,
  selectedMetricValue,
  timeShiftConfig,
  selectorComponent
}: PodChartPresentProps) {
  const selectedMetric = metrics.find(m => m.metric === selectedMetricValue) ?? metrics[0];
  return (
    <UnifiedMetricsChart
      rightHeaderContent={selectorComponent}
      title={title}
      config={{
        y1: {
          metrics: timeShiftConfig?.offset
            ? [{ ...selectedMetric, timeShift: timeShiftConfig.offset }, selectedMetric]
            : metrics,
          formatter,
          tooltipFormatter,
          colors: timeShiftConfig?.offset
            ? ([theme.lib.colors.timeShift, selectedMetric.color] as AxisColor[])
            : colors,
          renderer: line.id
        },
        type: 'TIME_SERIES'
      }}
      reverseTooltipOrder
      reverseLegendOrder
      renderPostChartContent={K8DashboardsMarkerLanes}
    />
  );
}
