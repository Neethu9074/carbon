/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useApdexConfigWithPreview from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigWithPreview';
import useApdexWidgetTimeConfig from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetTimeConfig';
import useMonitoredEntity from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity';
import useTagCatalogLoader from 'in-custom-dashboards/widgets/Apdex/hooks/useTagCatalogLoader';
import useApdexMetrics from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics';
import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { ApdexWidgetConfiguration } from 'in-custom-dashboards/widgets/Apdex/form';
import { widgetPreviewHeight } from 'in-custom-dashboards/widgets/Apdex';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { MetricDataSeries } from 'in-components/Chart/types';
import { sloFullEnabled } from 'in-services/featureFlags';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

export default function ApdexWidgetPresenterWrapper({
  actions,
  dragHandle,
  title,
  isPreview,
  isInModal,
  config
}: WidgetProps<ApdexWidgetConfiguration>) {
  if (!sloFullEnabled) return null;

  return (
    <ApdexWidgetPresenter
      actions={actions}
      dragHandle={dragHandle}
      title={title}
      isPreview={isPreview}
      isInModal={isInModal}
      config={config}
    />
  );
}

function ApdexWidgetPresenter({
  actions,
  dragHandle,
  title,
  isPreview,
  isInModal,
  config
}: Omit<WidgetProps<ApdexWidgetConfiguration>, 'timeConfig' | 'widgetId'>) {
  const originalTimeConfig = useApdexWidgetTimeConfig(isPreview);

  const { entityType, entityId, apdexConfigId } = config;
  const [apdexConfig, , , configProgress] = useApdexConfigWithPreview(apdexConfigId, isPreview);

  const tagCatalogLoader = useTagCatalogLoader(apdexConfig);
  const tagCatalog = useTagCatalog(tagCatalogLoader);

  const [entity, , , entityProgress] = useMonitoredEntity({ entityType, entityId });
  const entityLabel = entity?.label ?? t('in-custom-dashboards:widgets.unknownEntityLabel', { context: entityType });

  const [metrics, , errors, metricProgress] = useApdexMetrics({
    id: apdexConfigId,
    timeConfig: originalTimeConfig,
    isPreview
  });
  const granularity = metrics?.[0]?.granularity ?? 0;
  const timeConfig = { ...originalTimeConfig, ...metrics?.[0]?.adjustedTimeframe };

  const progress = all(configProgress, entityProgress, metricProgress);

  const height = isPreview ? widgetPreviewHeight : undefined;

  return (
    <ApdexWidget
      apdexConfig={apdexConfig}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      entityLabel={entityLabel}
      entityType={entityType}
      tagCatalog={tagCatalog}
      errors={errors}
      metrics={metrics?.map(r => r.values as MetricDataSeries) ?? []}
      progress={progress}
      granularity={granularity}
      timeConfig={timeConfig}
      isInModal={isInModal}
      automaticallySize={!isPreview}
      nonInteractive={isPreview}
      height={height}
      showPreviewDataNotice={isPreview}
    />
  );
}
