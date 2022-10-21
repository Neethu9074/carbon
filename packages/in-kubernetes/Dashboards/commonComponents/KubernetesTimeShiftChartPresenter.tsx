/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import KubernetesChartPresenter from './KubernetesChartPresenter';
import { AxisColor, Formatter } from 'in-components/Chart/types';

interface KubernetesTimeshiftChartPresenterProps {
  metrics: Metric[];
  title: string;
  colors: AxisColor[];
  formatter: string;
  tooltipFormatter?: Formatter;
  paramTab: string;
  paramMetric: string;
  path: string;
}

export default function KubernetesTimeShiftChartPresenter({
  metrics,
  title,
  colors,
  formatter,
  tooltipFormatter,
  paramTab,
  paramMetric,
  path
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
      <KubernetesChartPresenter
        metrics={metrics}
        title={title}
        colors={colors}
        formatter={formatter}
        tooltipFormatter={tooltipFormatter}
      />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}
