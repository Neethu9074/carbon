/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useApdexLineRenderer from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexLineRenderer';
import { ContextMenuConfig, MetricDataSeries } from 'in-components/Chart/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { Error, Progress, TimeConfig } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

const apdexAreas = [0, 0.7, 0.9, 1] as const;
const minApdex = apdexAreas[0];
const maxApdex = apdexAreas[apdexAreas.length - 1];

interface ApdexChartProps {
  metrics: MetricDataSeries[];
  errors: Error[];
  progress: Progress;
  granularity: number;
  timeConfig: TimeConfig;
  contextMenu?: Partial<ContextMenuConfig>;
  nonInteractive?: boolean;
  automaticallySize?: boolean;
  height?: number;
}

export default function ApdexChart({
  metrics,
  errors,
  progress,
  granularity,
  timeConfig,
  nonInteractive,
  automaticallySize,
  height,
  contextMenu = {}
}: ApdexChartProps) {
  const renderer = useApdexLineRenderer(apdexAreas);

  return (
    <ResultAwareChart
      config={{
        y1: {
          metricIds: ['APDEX'],
          labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
          colors: [theme.lib.colors.lightBlue800],
          renderer,
          metrics,
          fixedTickPositions: [...apdexAreas],
          detailedFormatting: true,
          renderAllTickLabels: true,
          min: minApdex,
          max: maxApdex
        },
        customHeight: height,
        granularity,
        automaticallySize,
        nonInteractive,
        timeConfig,
        ...contextMenu
      }}
      result={{
        errors,
        progress
      }}
      renderLegend
    />
  );
}
