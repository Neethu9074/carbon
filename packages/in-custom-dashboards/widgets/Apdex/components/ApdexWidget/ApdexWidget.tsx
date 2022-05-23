/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import WidgetHeader from 'in-custom-dashboards/widgets/Apdex/components/WidgetHeader';
import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';
import { ApdexType } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { Axis, MetricDataSeries } from 'in-components/Chart/types';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Error, Progress, TimeConfig } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface ApdexWidgetProps {
  title: string;
  entityType: ApdexType;
  entityLabel: string;
  dragHandle: React.ReactNode;
  actions: React.ReactNode;
  metrics: MetricDataSeries[];
  errors: Error[];
  progress: Progress;
  granularity: number;
  timeConfig: TimeConfig;
  nonInteractive?: boolean;
}

export default function ApdexWidget({
  title,
  dragHandle,
  actions,
  entityLabel,
  entityType,
  metrics,
  errors,
  progress,
  granularity,
  timeConfig,
  nonInteractive
}: ApdexWidgetProps) {
  return (
    <WidgetCard
      dragHandle={dragHandle}
      actions={actions}
      progress={progress}
      header={<WidgetHeader title={title} entityType={entityType} entityLabel={entityLabel} />}
    >
      <ResultAwareChart
        config={{
          y1: getAxis(metrics),
          granularity,
          automaticallySize: !nonInteractive,
          nonInteractive,
          timeConfig
        }}
        result={{
          errors,
          progress
        }}
        renderLegend
      />
    </WidgetCard>
  );
}

function getAxis(metrics: MetricDataSeries[]): Axis {
  return {
    metricIds: ['apdex'],
    labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
    colors: [theme.lib.colors.lightBlue800],
    renderer: Renderer.line,
    metrics
  };
}
