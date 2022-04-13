/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import { ensureConfigBackwardCompatibility, SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/form';
import WidgetLoadingIndicator from 'in-custom-dashboards/widgets/Slo/components/widget/WidgetLoadingIndicator';
import useSliConfigWithPreview from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigWithPreview';
import WidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/components/widget/WidgetLeftHeader';
import useWidgetTimeConfig from 'in-custom-dashboards/widgets/Slo/hooks/useWidgetTimeConfig';
import WidgetContent from 'in-custom-dashboards/widgets/Slo/components/widget/WidgetContent';
import useSloMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloMetrics';
import SliSummary from 'in-custom-dashboards/widgets/Slo/components/SliSummary';
import useSloEntity from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import { findMetric } from 'in-custom-dashboards/widgets/Slo/metric';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { days, hours, minutes } from 'in-services/time/time';
import { MetricDataSeries } from 'in-components/Chart/types';
import { all as allProgress } from 'in-hooks/utils/progress';
import { TimeConfig } from 'in-types';

import locals from './Widget.mless';

interface WidgetProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  isPreview?: boolean;
  title: string;
  dragHandle: React.ReactNode;
}

export default function Widget({ actions, config, isPreview, title, dragHandle }: WidgetProps) {
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

  const { timeConfig, fromTimestamp, toTimestamp } = useWidgetTimeConfig({
    isPreview,
    isRolling,
    isFixed,
    timeWindowDuration: ensuredTimeWindowDuration,
    timeWindowDurationUnit: ensuredTimeWindowDurationUnit,
    timeWindowStartDate,
    timeWindowStartTime
  });

  const [sliConfiguration, sliConfigurationStatus, , sliConfigurationProgress] = useSliConfigWithPreview(
    sliConfigId,
    timeConfig,
    isPreview
  );

  const [entity, entityStatus, , entityProgress] = useSloEntity({ entityId, entityType });

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

  const unifiedStatus = allStatus(sliConfigurationStatus, entityStatus, sloMetricsStatus);
  const unifiedProgress = allProgress(sliConfigurationProgress, entityProgress, sloMetricsProgress);

  const budget = getMetricValue(findMetric('budget', sloMetrics));

  return (
    <div className={locals.loadingBarContainer}>
      <WidgetLoadingIndicator progress={unifiedProgress} />
      <Card
        bodyClassName={locals.bodyNoPadding}
        rightHeaderContent={
          <>
            {dragHandle}
            {actions}
          </>
        }
        title={title}
        headerClassName={locals.title}
        leftHeaderContent={
          <WidgetLeftHeader
            status={unifiedStatus}
            monitoredEntityType={entityType}
            monitoredEntity={entity}
            sliConfig={sliConfiguration}
          />
        }
      >
        <SliSummary
          status={unifiedStatus}
          slo={slo}
          budget={budget}
          timeWindowType={timeWindowType ?? 'dynamic'}
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
          sliEntity={sliConfiguration?.sliEntity}
          metricSpent={getMetricValue(findMetric('spent', sloMetrics))}
          metricSli={getMetricValue(findMetric('sli', sloMetrics))}
          metricRemaining={getMetricValue(findMetric('remaining', sloMetrics))}
        />
        <div className={locals.chart}>
          <WidgetContent
            sloMetrics={sloMetrics}
            loadingErrors={sloMetricsError}
            loadingProgress={unifiedProgress}
            sliConfigId={sliConfigId}
            timeConfig={timeConfig}
            granularity={chartGranularity}
            budget={budget}
            sliConfig={sliConfiguration}
            isPreview={isPreview}
            disableZooming={isFixed || isRolling}
          />
        </div>
      </Card>
    </div>
  );
}

const getMetricValue = (metric: MetricDataSeries = []): number => {
  return metric[0]?.[1];
};

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
