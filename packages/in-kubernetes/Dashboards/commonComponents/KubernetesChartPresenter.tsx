/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { AxisColor, Formatter } from 'in-components/Chart/types';
import { line } from 'in-stores/metric/renderer';

interface KubernetesChartPresenterProps {
  metrics: Metric[];
  title: string;
  colors: AxisColor[];
  formatter: string;
  tooltipFormatter?: Formatter;
  rightHeaderContent?: React.ReactElement;
  reverseOrder?: boolean;
}

export default function KubernetesChartPresenter({
  metrics,
  title,
  colors,
  formatter,
  tooltipFormatter,
  rightHeaderContent,
  reverseOrder
}: KubernetesChartPresenterProps) {
  return (
    <UnifiedMetricsChart
      rightHeaderContent={rightHeaderContent}
      title={title}
      config={{
        y1: {
          metrics: metrics,
          formatter,
          tooltipFormatter,
          colors: colors,
          renderer: line.id
        },
        type: 'TIME_SERIES'
      }}
      reverseTooltipOrder={reverseOrder}
      reverseLegendOrder={reverseOrder}
      renderPostChartContent={K8DashboardsMarkerLanes}
    />
  );
}
