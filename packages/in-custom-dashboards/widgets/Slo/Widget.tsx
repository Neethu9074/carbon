/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import { ensureConfigBackwardCompatibility, SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/form';
import useWidgetTimeConfig from 'in-custom-dashboards/widgets/Slo/hooks/useWidgetTimeConfig';
import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import WidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/WidgetLeftHeader';
import useSloMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloMetrics';
import useSloEntity from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import { WidgetHeader } from 'in-custom-dashboards/widgets/Slo/WidgetHeader';
import { findMetric } from 'in-custom-dashboards/widgets/Slo/metric';
import { days, hours, minutes } from 'in-services/time/time';
import { MetricDataSeries } from 'in-components/Chart/types';
import { all } from 'in-hooks/utils/fetchStatus';
import WidgetContent from './WidgetContent';
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

  const [entity, entityStatus] = useSloEntity({ entityId, entityType });

  const [sloMetrics, sloMetricsStatus, sloMetricsError, sloMetricsProgress] = useSloMetrics({
    slo,
    sliId: sliConfigId,
    timeConfig,
    granularity,
    isPreview
  });

  const unifiedStatus = all(sliConfigurationStatus, entityStatus, sloMetricsStatus);

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
        unifiedStatus !== 'rejected' ? (
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
          sloMetrics={sloMetrics}
          loadingErrors={sloMetricsError}
          loadingProgress={sloMetricsProgress}
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
