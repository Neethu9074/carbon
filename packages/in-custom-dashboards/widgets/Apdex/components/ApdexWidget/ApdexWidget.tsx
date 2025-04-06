/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ApdexConfiguration, TagCatalog } from '@instana/types';
import { Error, Progress, TimeConfig } from '@instana/types';
import { Message } from '@instana/components';

import useShouldShowMissingDataIndicator from 'in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator';
import useApdexWidgetContextMenu from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetContextMenu';
import WidgetHeader from 'in-custom-dashboards/widgets/Apdex/components/WidgetHeader';
import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';
import ApdexChart from 'in-custom-dashboards/widgets/Apdex/components/ApdexChart';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { MetricDataSeries } from 'in-components/Chart/types';
import { t } from 'in-i18n';

import locals from './ApdexWidget.mless';

interface ApdexWidgetProps {
  title: string;
  entityType: ApdexEntityTypes;
  entityLabel: string;
  apdexConfig?: ApdexConfiguration;
  tagCatalog?: TagCatalog;
  dragHandle: React.ReactNode;
  actions: React.ReactNode;
  metrics: MetricDataSeries[];
  errors: Error[];
  progress: Progress;
  granularity: number;
  timeConfig: TimeConfig;
  nonInteractive?: boolean;
  automaticallySize?: boolean;
  height?: number;
  isInModal?: boolean;
  showPreviewDataNotice?: boolean;
}

export default function ApdexWidget({
  title,
  dragHandle,
  actions,
  entityLabel,
  entityType,
  apdexConfig,
  tagCatalog,
  metrics,
  errors,
  progress,
  granularity,
  timeConfig,
  nonInteractive,
  automaticallySize,
  isInModal,
  height,
  showPreviewDataNotice
}: ApdexWidgetProps) {
  const contextMenu = useApdexWidgetContextMenu({ apdexConfig, tagCatalog });

  const showMissingDataIndicators = useShouldShowMissingDataIndicator({
    initialEvaluationTimestamp: apdexConfig?.createdAt,
    progress,
    timeConfig,
    nonInteractive
  });

  return (
    <WidgetCard
      progress={progress}
      isInModal={isInModal}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
      leftHeaderContent={
        <WidgetHeader
          apdexConfig={apdexConfig}
          title={title}
          entityType={entityType}
          entityLabel={entityLabel}
          showPreviewDataNotice={showPreviewDataNotice}
        />
      }
    >
      <div className={locals.apdexChartWrapper}>
        <ApdexChart
          apdexConfig={apdexConfig}
          metrics={metrics}
          errors={errors}
          progress={progress}
          granularity={granularity}
          timeConfig={timeConfig}
          showMissingDataIndicators={showMissingDataIndicators}
          nonInteractive={nonInteractive}
          contextMenu={contextMenu}
          automaticallySize={automaticallySize}
          height={height}
        />
        {showMissingDataIndicators && (
          <div>
            <Message
              title={t('in-custom-dashboards:widgets.slo.chart.missingDataInfo', {
                configType: t('in-custom-dashboards:widgets.slo.chart.configType', { context: 'apdex' })
              })}
              withIcon
              dismissible
              small
            />
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
