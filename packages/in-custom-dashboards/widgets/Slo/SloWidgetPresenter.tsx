/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useMetricAlignedWidgetTimeConfig from 'in-custom-dashboards/widgets/Slo/hooks/useMetricAlignedWidgetTimeConfig';
import { ensureConfigBackwardCompatibility, SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/form';
import useSliConfigWithPreview from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigWithPreview';
import useWidgetTimeConfig from 'in-custom-dashboards/widgets/Slo/hooks/useWidgetTimeConfig';
import useMonitoredEntity from 'in-custom-dashboards/widgets/Slo/hooks/useMonitoredEntity';
import useSloMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloMetrics';
import Widget from 'in-custom-dashboards/widgets/Slo/components/widget/Widget';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { days, hours, minutes } from 'in-services/time/time';
import { all as allProgress } from 'in-hooks/utils/progress';
import { TimeConfig } from 'in-types';

interface SloWidgetPresenterProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  isPreview?: boolean;
  title: string;
  dragHandle: React.ReactNode;
}

export default function SloWidgetPresenter({ actions, config, isPreview, title, dragHandle }: SloWidgetPresenterProps) {
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

  const granularity = getGranularity(timeConfig);
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
      disableZooming={isFixed || isRolling}
    />
  );
}

function getGranularity(timeConfig: TimeConfig): number {
  const now = Date.now();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;
  const oneDay = days.toMillis(1);

  if (timeConfig.windowSize < oneDay && from > now - oneDay) {
    // if timeframe is within the last 24 hours, and window-size less than a day, then request metric in
    // one minute granularity. We do not want to query CH with oneMinute granularity with large windowSize as
    // this would lead to performance problems.
    return minutes.toMillis(1);
  }
  return hours.toMillis(1);
}
