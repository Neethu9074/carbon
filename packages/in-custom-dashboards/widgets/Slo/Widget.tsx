/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Card } from '@instana/components';

import { ensureConfigBackwardCompatibility, SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/form';
import { isApplicationSliEntity, isAvailabilitySliEntity } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { trackJumpToUnboundedAnalyticsFromSloWidget } from 'in-custom-dashboards/widgets/Slo/tracker';
import { MetricResult, Result, SliConfigurationWithLastUpdated, TimeConfig } from 'in-types';
import useWidgetTimeConfig from 'in-custom-dashboards/widgets/Slo/hooks/useWidgetTimeConfig';
import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import WidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/WidgetLeftHeader';
import useSloMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloMetrics';
import useSloEntity from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import Chart, { ChartTrackers } from 'in-custom-dashboards/widgets/Slo/Chart';
import { WidgetHeader } from 'in-custom-dashboards/widgets/Slo/WidgetHeader';
import { days, hours, minutes } from 'in-services/time/time';
import { MetricDataSeries } from 'in-components/Chart/types';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

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

  const isDynamic = timeWindowType === 'dynamic';
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

  const granularity = getGranularity(timeConfig);

  const [sliConfiguration, sliConfigurationStatus] = useSliConfiguration(sliConfigId);
  const [entity] = useSloEntity({ entityId, entityType });

  const sloMetricsResult = useSloMetrics({ slo, sliId: sliConfigId, timeConfig, granularity, isPreview });

  const sloMetrics = sloMetricsResult?.data;

  const budget = getMetricValue(findMetric('budget', sloMetrics));

  return (
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
        sliConfigurationStatus !== 'rejected' ? (
          <WidgetLeftHeader monitoredEntityType={entityType} monitoredEntity={entity} sliConfig={sliConfiguration} />
        ) : (
          undefined
        )
      }
    >
      <WidgetHeader
        slo={slo}
        budget={budget}
        isDynamic={isDynamic}
        isRolling={isRolling}
        fromTimestamp={fromTimestamp}
        toTimestamp={toTimestamp}
        sliEntity={sliConfiguration?.sliEntity}
        metricSpent={getMetricValue(findMetric('spent', sloMetrics))}
        metricSli={getMetricValue(findMetric('sli', sloMetrics))}
        metricRemaining={getMetricValue(findMetric('remaining', sloMetrics))}
      />
      <div className={locals.chart}>
        <WidgetContent
          sloMetricsResult={sloMetricsResult}
          sliConfigId={sliConfigId}
          timeConfig={timeConfig}
          granularity={granularity}
          budget={budget}
          sliConfig={sliConfiguration}
          isPreview={isPreview}
          disableZooming={isFixed || isRolling}
        />
      </div>
    </Card>
  );
}

const findMetric = (metricName: string, sloMetrics: MetricResult[] = []): MetricDataSeries => {
  const metric = sloMetrics?.find(({ id }) => id === metricName);
  return (metric?.values ?? []) as MetricDataSeries;
};

const getMetricValue = (metric: MetricDataSeries = []): number => {
  return metric[0]?.[1];
};

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

const isConfiguredSliDeleted = (sloMetricsResult: Result<MetricResult[]>, sliConfigId: string): boolean => {
  return (
    hasError(sloMetricsResult) &&
    sloMetricsResult.errors.some(
      ({ message }) => message === `The SliConfiguration for the id ${sliConfigId} does not exist`
    )
  );
};

interface WidgetContentProps {
  sloMetricsResult: Result<MetricResult[]>;
  sliConfigId: string;
  timeConfig: TimeConfig;
  granularity: number;
  budget: number;
  sliConfig?: SliConfigurationWithLastUpdated;
  isPreview?: boolean;
  disableZooming?: boolean;
}

const WidgetContent = ({ sloMetricsResult, sliConfigId, isPreview, ...otherChartProps }: WidgetContentProps) => {
  if (isConfiguredSliDeleted(sloMetricsResult, sliConfigId)) {
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
      result={sloMetricsResult}
      consumed={filterAvailableData(findMetric('consumed', sloMetricsResult?.data))}
      hourlyBudget={filterAvailableData(findMetric('hourlyBudget', sloMetricsResult?.data))}
      trackers={chartTrackers}
      automaticallySize={!isPreview}
      {...otherChartProps}
    />
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
