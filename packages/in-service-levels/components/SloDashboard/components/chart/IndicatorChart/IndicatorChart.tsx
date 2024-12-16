/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  isSyntheticSloEntity,
  ServiceLevelIndicatorUnion,
  SloEntityUnion,
  TimeWindowUnion
} from '@instana/types';

import SyntheticsEventBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/SyntheticsEventBasedAvailabilityIndicatorChart';
import SyntheticsTimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/SyntheticsTimeBasedAvailabilityIndicatorChart';
import SyntheticsEventBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/SyntheticsEventBasedLatencyIndicatorChart';
import SyntheticsTimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/SyntheticsTimeBasedLatencyIndicatorChart';
import SyntheticsTimeBasedTrafficIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/SyntheticsTimeBasedTrafficIndicatorChart';
import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedTrafficIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedTrafficIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';

interface IndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  timeWindow: TimeWindowUnion;
  createdDate?: DateAsNumber;
  title?: string;
}

export default function IndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  timeWindow,
  createdDate,
  title
}: IndicatorChartProps) {
  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;

  if (isSyntheticSloEntity(entity)) {
    if (indicator.blueprint === 'traffic' && indicator.type === 'timeBased') {
      return (
        <SyntheticsTimeBasedTrafficIndicatorChart
          automaticallySize={automaticallySize}
          customHeight={customHeight}
          customChartSkeletonHeight={customChartSkeletonHeight}
          entity={entity}
          indicator={indicator}
          missingDataIndicator={missingDataIndicator}
          title={title}
        />
      );
    }

    if (indicator.blueprint === 'latency' && indicator.type === 'timeBased') {
      return (
        <SyntheticsTimeBasedLatencyIndicatorChart
          automaticallySize={automaticallySize}
          customHeight={customHeight}
          customChartSkeletonHeight={customChartSkeletonHeight}
          indicator={indicator}
          entity={entity}
          missingDataIndicator={missingDataIndicator}
          title={title}
        />
      );
    }

    if (indicator.blueprint === 'availability' && indicator.type === 'timeBased') {
      return (
        <SyntheticsTimeBasedAvailabilityIndicatorChart
          automaticallySize={automaticallySize}
          customHeight={customHeight}
          customChartSkeletonHeight={customChartSkeletonHeight}
          indicator={indicator}
          entity={entity}
          missingDataIndicator={missingDataIndicator}
          title={title}
        />
      );
    }

    if (indicator.blueprint === 'latency' && indicator.type === 'eventBased') {
      return (
        <SyntheticsEventBasedLatencyIndicatorChart
          automaticallySize={automaticallySize}
          customHeight={customHeight}
          customChartSkeletonHeight={customChartSkeletonHeight}
          entity={entity}
          indicator={indicator}
          missingDataIndicator={missingDataIndicator}
          title={title}
        />
      );
    }

    if (indicator.blueprint === 'availability' && indicator.type === 'eventBased') {
      return (
        <SyntheticsEventBasedAvailabilityIndicatorChart
          automaticallySize={automaticallySize}
          customHeight={customHeight}
          customChartSkeletonHeight={customChartSkeletonHeight}
          entity={entity}
          indicator={indicator}
          missingDataIndicator={missingDataIndicator}
          title={title}
        />
      );
    }
  }

  if (indicator.blueprint === 'traffic' && indicator.type === 'timeBased') {
    return (
      <TimeBasedTrafficIndicatorChart
        automaticallySize={automaticallySize}
        customHeight={customHeight}
        customChartSkeletonHeight={customChartSkeletonHeight}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={missingDataIndicator}
        title={title}
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
        missingDataIndicator={missingDataIndicator}
        title={title}
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
        missingDataIndicator={missingDataIndicator}
        title={title}
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
        missingDataIndicator={missingDataIndicator}
        title={title}
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
        missingDataIndicator={missingDataIndicator}
        title={title}
      />
    );
  }

  return null;
}
