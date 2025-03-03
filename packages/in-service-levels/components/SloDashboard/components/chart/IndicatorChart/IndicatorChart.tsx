/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion
} from '@instana/types';

import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import TimeBasedTrafficIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedTrafficIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';

interface IndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  createdDate?: DateAsNumber;
  title?: string;
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function IndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  createdDate,
  title,
  configuration
}: IndicatorChartProps) {
  if (indicator.blueprint === 'traffic' && indicator.type === 'timeBased') {
    return (
      <TimeBasedTrafficIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        customChartSkeletonHeight={customChartSkeletonHeight}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={createdDate}
        title={title}
        configuration={configuration}
      />
    );
  }

  if (indicator.blueprint === 'latency' && indicator.type === 'timeBased') {
    return (
      <TimeBasedLatencyIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        customChartSkeletonHeight={customChartSkeletonHeight}
        indicator={indicator}
        entity={entity}
        missingDataIndicator={createdDate}
        title={title}
        configuration={configuration}
      />
    );
  }
  if (indicator.blueprint === 'availability' && indicator.type === 'timeBased') {
    return (
      <TimeBasedAvailabilityIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        customChartSkeletonHeight={customChartSkeletonHeight}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={createdDate}
        title={title}
        configuration={configuration}
      />
    );
  }
  if (indicator.type === 'eventBased') {
    return (
      <EventBasedIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        customChartSkeletonHeight={customChartSkeletonHeight}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={createdDate}
        title={title}
        configuration={configuration}
      />
    );
  }

  // @ts-expect-error customEventBased indicator is just a legacy type that is only used on test-systems and can be removed in future
  if (indicator.type === 'customEventBased') {
    return (
      <EventBasedIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={createdDate}
        title={title}
        configuration={configuration}
      />
    );
  }

  return null;
}
