/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useMetricAlignedWidgetTimeConfig from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMetricAlignedWidgetTimeConfig';
import { ensureConfigBackwardCompatibility, SloWidgetConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/form';
import useSliConfigWithPreview from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigWithPreview';
import useWidgetTimeConfig from 'in-custom-dashboards/widgets/SloLegacy/hooks/useWidgetTimeConfig';
import useMonitoredEntity from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity';
import useSloMetrics from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSloMetrics';
import Widget from 'in-custom-dashboards/widgets/SloLegacy/components/widget/Widget';
import { sloFullEnabled, sloLiteEnabled } from 'in-services/featureFlags';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';

export default function SloWidgetPresenterWrapper({
  actions,
  config,
  isPreview,
  title,
  isInModal,
  dragHandle
}: WidgetProps<SloWidgetConfiguration>) {
  const { entityType } = ensureConfigBackwardCompatibility(config);

  if ((!sloLiteEnabled && !sloFullEnabled) || (entityType === 'website' && !sloFullEnabled)) return null;

  return (
    <SloWidgetPresenter
      actions={actions}
      config={config}
      isPreview={isPreview}
      title={title}
      isInModal={isInModal}
      dragHandle={dragHandle}
    />
  );
}

function SloWidgetPresenter({
  actions,
  config,
  isPreview,
  title,
  isInModal,
  dragHandle
}: Omit<WidgetProps<SloWidgetConfiguration>, 'timeConfig' | 'widgetId'>) {
  const {
    slo,
    entityId,
    entityType,
    sliConfigId,
    timeWindowType,
    timeWindowDuration,
    timeWindowDurationUnit,
    timeWindowStart
  } = ensureConfigBackwardCompatibility(config);

  const isRolling = timeWindowType === 'rolling';
  const isFixed = timeWindowType === 'fixed';

  const ensuredTimeWindowDuration = timeWindowDuration ?? 1;
  const ensuredTimeWindowDurationUnit = timeWindowDurationUnit ?? 'weeks';

  const timeWindowStartDate = timeWindowStart?.date;
  const timeWindowStartTime = timeWindowStart?.time;

  const timeWindowConfig = useWidgetTimeConfig({
    isPreview,
    isRolling,
    isFixed,
    timeWindowDuration: ensuredTimeWindowDuration,
    timeWindowDurationUnit: ensuredTimeWindowDurationUnit,
    timeWindowStartDate,
    timeWindowStartTime
  });
  const { timeConfig } = timeWindowConfig;

  const [sliConfiguration, sliConfigurationStatus, , sliConfigurationProgress] = useSliConfigWithPreview(
    sliConfigId,
    isPreview
  );

  const [entity, entityStatus, , entityProgress] = useMonitoredEntity({ entityId, entityType });

  const granularity = calculateSloGranularity(timeConfig);
  const [sloMetrics, sloMetricsStatus, sloMetricsError, sloMetricsProgress] = useSloMetrics({
    slo,
    sliId: sliConfigId,
    timeConfig,
    granularity,
    isPreview
  });

  const [firstMetric] = sloMetrics ?? [];
  const chartGranularity = firstMetric?.granularity || granularity;

  const chartTimeWindowConfig = useMetricAlignedWidgetTimeConfig(timeWindowConfig, firstMetric);

  const unifiedStatus = allStatus(sliConfigurationStatus, entityStatus, sloMetricsStatus);
  const unifiedProgress = allProgress(sliConfigurationProgress, entityProgress, sloMetricsProgress);

  return (
    <Widget
      title={title}
      entityType={entityType}
      entity={entity}
      sliConfiguration={sliConfiguration}
      slo={slo}
      sloMetrics={sloMetrics}
      granularity={chartGranularity}
      timeWindowType={timeWindowType}
      timeWindowConfig={chartTimeWindowConfig}
      status={unifiedStatus}
      progress={unifiedProgress}
      errors={sloMetricsError}
      actions={actions}
      dragHandle={dragHandle}
      isPreview={isPreview}
      isInModal={isInModal}
      disableZooming={isFixed || isRolling}
    />
  );
}
