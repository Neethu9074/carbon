/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Message } from '@instana/components';

import { Error, MetricResult, Progress, SliConfigurationWithLastUpdated, TimeConfig } from 'in-types';
import Chart from 'in-custom-dashboards/widgets/Slo/components/Chart/Chart';
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

const isConfiguredSliDeleted = (sloMetricsErrors: Error[]): boolean => {
  return sloMetricsErrors.some(({ code }) => code === 'NOT_FOUND');
};

interface WidgetContentProps {
  sloMetrics?: MetricResult[];
  loadingErrors: Error[];
  loadingProgress: Progress;
  timeConfig: TimeConfig;
  granularity: number;
  budget: number;
  sliConfig?: SliConfigurationWithLastUpdated;
  nonInteractive?: boolean;
  disableZooming?: boolean;
}

export default function WidgetContent({
  sloMetrics,
  loadingErrors,
  loadingProgress,
  ...otherChartProps
}: WidgetContentProps) {
  if (isConfiguredSliDeleted(loadingErrors)) {
    return (
      <Message
        type="error"
        title={t('in-custom-dashboards:widgets.chart.errorTitleForConfiguredSliDeletion')}
        description={t('in-custom-dashboards:widgets.chart.errorDescriptionToConfigureOtherSLI')}
        withIcon
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
      {...otherChartProps}
    />
  );
}
