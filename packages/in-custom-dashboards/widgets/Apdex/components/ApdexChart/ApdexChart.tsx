/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Error, Progress, TimeConfig, ApdexConfiguration } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { Message } from '@instana/components';

import useApdexRetentionPeriodCheck from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexRetentionPeriodCheck';
import ChartMarkerLanes from 'in-custom-dashboards/widgets/SloLegacy/components/ChartMarkerLanes';
import useApdexLineRenderer from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexLineRenderer';
import { ContextMenuConfig, MetricDataSeries } from 'in-components/Chart/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { t } from 'in-i18n';

const apdexAreas = [0, 0.7, 0.9, 1] as const;
const minApdex = apdexAreas[0];
const maxApdex = apdexAreas[apdexAreas.length - 1];

const isConfiguredApdexDeleted = (errors: Error[]): boolean => {
  return errors.some(({ code }) => code === 'NOT_FOUND');
};

interface ApdexChartProps {
  metrics: MetricDataSeries[];
  errors: Error[];
  progress: Progress;
  granularity: number;
  timeConfig: TimeConfig;
  showMissingDataIndicators?: boolean;
  contextMenu?: Partial<ContextMenuConfig>;
  nonInteractive?: boolean;
  automaticallySize?: boolean;
  height?: number;
  apdexConfig?: ApdexConfiguration;
}

export default function ApdexChart({
  apdexConfig,
  metrics,
  errors,
  progress,
  granularity,
  timeConfig,
  showMissingDataIndicators,
  nonInteractive,
  automaticallySize,
  height,
  contextMenu = {}
}: ApdexChartProps) {
  const renderer = useApdexLineRenderer(apdexAreas, apdexConfig?.createdAt);
  const isInRetentionPeriod = useApdexRetentionPeriodCheck(timeConfig);

  if (isConfiguredApdexDeleted(errors)) {
    return (
      <Message
        type="error"
        title={t('in-custom-dashboards:widgets.apdex.chart.notFoundErrorTitle')}
        description={t('in-custom-dashboards:widgets.apdex.chart.notFoundErrorDescription')}
        withIcon
      />
    );
  }

  if (!isInRetentionPeriod) {
    return (
      <NoDataAvailable
        title={t('in-components:entityVersionList.noDataAvailable')}
        text={t('in-custom-dashboards:widgets.apdex.chart.noDataRetentionPeriod')}
      />
    );
  }

  return (
    <ResultAwareChart
      config={{
        y1: {
          metricIds: ['APDEX'],
          labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
          colors: [themes.default.ids.color.option.blue[400]],
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
        renderPostChartContent: ({
          chartWidth = 0,
          chartBucketWidth = 0,
          timeAxisHeight,
          markerPaneHeight,
          chartContentPosition,
          timeConfig,
          ...props
        }) => {
          if (!showMissingDataIndicators) return;
          return (
            <ChartMarkerLanes
              tooltipContent={t('in-custom-dashboards:widgets.slo.chart.initialEvaluation', {
                configType: t('in-custom-dashboards:widgets.slo.chart.configType', { context: 'apdex' })
              })}
              timeConfig={timeConfig}
              initialEvaluationTimestamp={apdexConfig?.createdAt}
              chartWidth={chartWidth}
              chartBucketWidth={chartBucketWidth}
              timeAxisHeight={timeAxisHeight}
              markerPaneHeight={markerPaneHeight}
              chartContentPosition={chartContentPosition}
              {...props}
            />
          );
        },

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
