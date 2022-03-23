/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Message } from '@instana/components';

import { isApplicationSliEntity, isAvailabilitySliEntity } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { Error, MetricResult, Progress, SliConfigurationWithLastUpdated, TimeConfig } from 'in-types';
import { trackJumpToUnboundedAnalyticsFromSloWidget } from 'in-custom-dashboards/widgets/Slo/tracker';
import Chart, { ChartTrackers } from 'in-custom-dashboards/widgets/Slo/components/Chart/Chart';
import { findMetric } from 'in-custom-dashboards/widgets/Slo/metric';
import { MetricDataSeries } from 'in-components/Chart/types';
import { t } from 'in-i18n';

const filterAvailableData = (dataSeries: MetricDataSeries): MetricDataSeries => {
  if (!dataSeries) {
    return [];
  }
  // when no data for a specific metric was returned
  if (dataSeries.length === 1) {
    if (dataSeries[0][0] == null) {
      return [];
    }
  }
  // Filtering-out the values with timestamps in future
  // This should be done on the backend normally, but it was not specified, hence it was
  // implemented on the client in time.
  const now = new Date().getTime();
  return dataSeries.filter(([ts]) => ts <= now);
};

const isConfiguredSliDeleted = (sloMetricsErrors: Error[], sliConfigId: string): boolean => {
  return (
    sloMetricsErrors.length > 0 &&
    sloMetricsErrors.some(({ message }) => message === `The SliConfiguration for the id ${sliConfigId} does not exist`)
  );
};

const chartTrackers: ChartTrackers = {
  trackJumpToUnboundedAnalytics: entity => {
    if (isAvailabilitySliEntity(entity) || isApplicationSliEntity(entity)) {
      const { sliType, applicationId, serviceId, endpointId, boundaryScope } = entity;
      trackJumpToUnboundedAnalyticsFromSloWidget({
        sliType,
        applicationId,
        serviceId,
        endpointId,
        boundaryScope
      });
    }
  }
};

interface WidgetContentProps {
  sloMetrics?: MetricResult[];
  loadingErrors: Error[];
  loadingProgress: Progress;
  sliConfigId: string;
  timeConfig: TimeConfig;
  granularity: number;
  budget: number;
  sliConfig?: SliConfigurationWithLastUpdated;
  isPreview?: boolean;
  disableZooming?: boolean;
}

export default function WidgetContent({
  sloMetrics,
  loadingErrors,
  loadingProgress,
  sliConfigId,
  isPreview,
  ...otherChartProps
}: WidgetContentProps) {
  if (isConfiguredSliDeleted(loadingErrors, sliConfigId)) {
    return (
      <Message
        type="error"
        withIcon
        title={t('in-custom-dashboards:widgets.chart.errorTitleForConfiguredSliDeletion')}
        description={t('in-custom-dashboards:widgets.chart.errorDescriptionToConfigureOtherSLI')}
      />
    );
  }

  return (
    <Chart
      result={{
        data: sloMetrics,
        errors: loadingErrors,
        progress: loadingProgress
      }}
      consumed={filterAvailableData(findMetric('consumed', sloMetrics))}
      hourlyBudget={filterAvailableData(findMetric('hourlyBudget', sloMetrics))}
      trackers={chartTrackers}
      automaticallySize={!isPreview}
      {...otherChartProps}
    />
  );
}
