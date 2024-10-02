/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DateAsNumber, ServiceLevelIndicatorUnion, SloEntityUnion, TimeWindowUnion } from '@instana/types';

import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';

interface IndicatorChartProps {
  automaticallySized?: boolean;
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  timeWindow: TimeWindowUnion;
  createdDate?: DateAsNumber;
  title?: string;
}

export default function IndicatorChart({
  automaticallySized,
  entity,
  indicator,
  timeWindow,
  createdDate,
  title
}: IndicatorChartProps) {
  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;
  if (indicator.blueprint === 'latency' && indicator.type === 'timeBased') {
    return (
      <TimeBasedLatencyIndicatorChart
        automaticallySized={automaticallySized}
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
        automaticallySized={automaticallySized}
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
        automaticallySized={automaticallySized}
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
        automaticallySized={automaticallySized}
        entity={entity}
        indicator={indicator}
        missingDataIndicator={missingDataIndicator}
        title={title}
      />
    );
  }

  return null;
}
