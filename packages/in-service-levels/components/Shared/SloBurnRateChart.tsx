/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import ControlledSloBurnRateChart from 'in-service-levels/components/Shared/ControlledSloBurnRateChart';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { MetricDataSeries } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';

interface SloBurnRateChartPeops {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  timeConfig: TimeConfig;
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
  correctionWindowMetrics?: MetricDataSeries;
}

export default function SloBurnRateChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  timeConfig,
  timeWindows,
  timeWindowColors,
  configuration,
  title,
  correctionWindowMetrics
}: SloBurnRateChartPeops) {
  const granularity = calculateSloGranularity(timeConfig);
  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics({
    sloConfig: configuration,
    getMetricConfigForTimeConfig: timeConfig =>
      sloMetrics.burnRate.timeSeries({
        configId: configuration.id!,
        timeConfig,
        granularity
      }),
    timeConfig,
    timeWindows,
    granularity
  });

  const metricsWithGranularity = metricResult
    ? { ...metricResult, granularity: metricResult?.granularity ?? granularity }
    : undefined;

  return (
    <ControlledSloBurnRateChart
      automaticallySize={automaticallySize}
      customHeight={customHeight}
      customChartSkeletonHeight={customChartSkeletonHeight}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
      metrics={metricsWithGranularity}
      errors={errors}
      progress={progress}
      correctionWindowMetrics={correctionWindowMetrics}
      renderPostChartContent={props => <SloDashboardMarkerLanes entity={configuration.entity} {...props} />}
    />
  );
}
