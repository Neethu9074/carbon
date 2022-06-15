/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useMonitoredEntity from 'in-custom-dashboards/widgets/Slo/hooks/useMonitoredEntity';
import useApdexMetrics from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics';
import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { ApdexWidgetConfiguration } from 'in-custom-dashboards/widgets/Apdex/form';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { apdexWidgetEnabled } from 'in-services/featureFlags';
import { all as allProgress } from 'in-hooks/utils/progress';
import { MetricDataSeries } from 'in-components/Chart/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function ApdexWidgetPresenter({
  actions,
  dragHandle,
  title,
  isPreview,
  config
}: WidgetProps<ApdexWidgetConfiguration>) {
  const originalTimeConfig = useTimeConfig();

  const { entityType, entityId, apdexConfigId } = config;
  const [entity, , , entityProgress] = useMonitoredEntity({ entityType, entityId });
  const entityLabel =
    entity?.label ?? t('in-custom-dashboards:widgets.apdex.widget.unknownEntityLabel', { context: entityType });

  const [metrics, , errors, metricProgress] = useApdexMetrics({
    id: apdexConfigId,
    timeConfig: originalTimeConfig,
    isPreview
  });
  const granularity = metrics?.[0]?.granularity ?? 0;
  const timeConfig = { ...originalTimeConfig, ...metrics?.[0]?.adjustedTimeframe };

  const progress = allProgress(entityProgress, metricProgress);

  if (!apdexWidgetEnabled) return;

  return (
    <ApdexWidget
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      entityLabel={entityLabel}
      entityType={entityType}
      errors={errors}
      metrics={metrics?.map(r => r.values as MetricDataSeries) ?? []}
      progress={progress}
      granularity={granularity}
      timeConfig={timeConfig}
      nonInteractive={isPreview}
    />
  );
}
