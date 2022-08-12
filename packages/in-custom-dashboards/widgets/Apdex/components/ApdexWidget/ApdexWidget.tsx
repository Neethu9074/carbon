/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ApdexConfiguration, TagCatalog } from '@instana/types';
import { Error, Progress, TimeConfig } from '@instana/types';

import useApdexWidgetContextMenu from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetContextMenu';
import WidgetHeader from 'in-custom-dashboards/widgets/Apdex/components/WidgetHeader';
import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';
import ApdexChart from 'in-custom-dashboards/widgets/Apdex/components/ApdexChart';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { MetricDataSeries } from 'in-components/Chart/types';

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
  height,
  showPreviewDataNotice
}: ApdexWidgetProps) {
  const contextMenu = useApdexWidgetContextMenu({ apdexConfig, tagCatalog });

  return (
    <WidgetCard
      dragHandle={dragHandle}
      actions={actions}
      progress={progress}
      header={
        <WidgetHeader
          apdexConfig={apdexConfig}
          title={title}
          entityType={entityType}
          entityLabel={entityLabel}
          showPreviewDataNotice={showPreviewDataNotice}
        />
      }
    >
      <ApdexChart
        metrics={metrics}
        errors={errors}
        progress={progress}
        granularity={granularity}
        timeConfig={timeConfig}
        nonInteractive={nonInteractive}
        contextMenu={contextMenu}
        automaticallySize={automaticallySize}
        height={height}
      />
    </WidgetCard>
  );
}
