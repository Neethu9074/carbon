/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeShift } from '@instana/types';

// @ts-expect-error
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import KubernetesChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesChartPresenter';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { AxisColor, Formatter } from 'in-components/Chart/types';
import theme from 'in-themes';

interface KubernetesTimeshiftChartPresenterProps {
  metrics: Metric[];
  title: string;
  colors: AxisColor[];
  formatter: string;
  tooltipFormatter?: Formatter;
  paramTab: string;
  paramMetric: string;
  path: string;
  snapshotId?: string;
  hasActionlane?: boolean;
  hasButtonInActionslane?: boolean;
}

export default function KubernetesTimeShiftChartPresenter({
  metrics,
  title,
  colors,
  formatter,
  tooltipFormatter,
  paramTab,
  paramMetric,
  path,
  snapshotId,
  hasActionlane = false,
  hasButtonInActionslane = true
}: KubernetesTimeshiftChartPresenterProps) {
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={title}
      tabs={[
        {
          id: paramTab,
          label: title
        }
      ]}
      metrics={metrics.map((m, i) => ({
        id: m.metric,
        label: m.label,
        value: m.metric,
        tab: paramTab,
        tabDefault: i === 0
      }))}
      urlMatrixParamConfig={{ path, paramTab, paramMetric }}
    >
      <Chart
        metrics={metrics}
        title={title}
        colors={colors}
        formatter={formatter}
        tooltipFormatter={tooltipFormatter}
        snapshotId={snapshotId}
        hasActionlane={hasActionlane}
        hasButtonInActionslane={hasButtonInActionslane}
      />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

interface ChartProps {
  metrics: Metric[];
  title: string;
  colors: AxisColor[];
  formatter: string;
  tooltipFormatter?: Formatter;
  // following fields are passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectedMetricValue?: string;
  timeShiftConfig?: TimeShift;
  selectorComponent?: JSX.Element;
  snapshotId?: string;
  hasActionlane?: boolean;
  hasButtonInActionslane?: boolean;
}

function Chart({
  metrics: originalMetrics,
  title,
  colors: originalColors,
  formatter,
  tooltipFormatter,
  selectedMetricValue,
  timeShiftConfig,
  selectorComponent,
  snapshotId,
  hasActionlane,
  hasButtonInActionslane
}: ChartProps): JSX.Element {
  let metrics = originalMetrics;
  let colors = originalColors;
  const selectedMetric = metrics.find(m => m.metric === selectedMetricValue) ?? metrics[0];
  if (timeShiftConfig?.offset !== 0) {
    metrics = [selectedMetric, { ...selectedMetric, timeShift: 0 }];
    colors = [theme.lib.colors.timeShift, selectedMetric.color] as AxisColor[];
  }
  return (
    <KubernetesChartPresenter
      metrics={metrics}
      title={title}
      colors={colors}
      formatter={formatter}
      tooltipFormatter={tooltipFormatter}
      rightHeaderContent={selectorComponent}
      snapshotId={snapshotId}
      hasActionlane={hasActionlane}
      hasButtonInActionslane={hasButtonInActionslane}
    />
  );
}
