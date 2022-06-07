/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useApdexLineRenderer from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexLineRenderer';
import WidgetHeader from 'in-custom-dashboards/widgets/Apdex/components/WidgetHeader';
import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { Error, Progress, TimeConfig } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

const apdexAreas = [0, 0.7, 0.9, 1] as const;

interface ApdexWidgetProps {
  title: string;
  entityType: ApdexEntityTypes;
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
  const renderer = useApdexLineRenderer(apdexAreas);

  return (
    <WidgetCard
      dragHandle={dragHandle}
      actions={actions}
      progress={progress}
      header={<WidgetHeader title={title} entityType={entityType} entityLabel={entityLabel} />}
    >
      <ResultAwareChart
        config={{
          y1: {
            metricIds: ['apdex'],
            labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
            colors: [theme.lib.colors.lightBlue800],
            renderer,
            metrics,
            fixedTickPositions: [...apdexAreas],
            detailedFormatting: true,
            renderAllTickLabels: true
          },
          granularity,
          automaticallySize: true,
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
