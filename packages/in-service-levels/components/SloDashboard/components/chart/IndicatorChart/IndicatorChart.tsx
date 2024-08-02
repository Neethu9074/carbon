/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';

export interface IndicatorChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function IndicatorChart({ configuration }: IndicatorChartProps) {
  const { entity, indicator, timeWindow, createdDate } = configuration;
  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;
  if (indicator.blueprint === 'latency' && indicator.type === 'timeBased') {
    return (
      <TimeBasedLatencyIndicatorChart
        indicator={indicator}
        entity={entity}
        missingDataIndicator={missingDataIndicator}
      />
    );
  }
  if (indicator.blueprint === 'availability' && indicator.type === 'timeBased') {
    return (
      <TimeBasedAvailabilityIndicatorChart
        entity={entity}
        indicator={indicator}
        missingDataIndicator={missingDataIndicator}
      />
    );
  }
  if (indicator.type === 'eventBased') {
    return (
      <EventBasedIndicatorChart entity={entity} indicator={indicator} missingDataIndicator={missingDataIndicator} />
    );
  }

  // @ts-expect-error customEventBased indicator is just a legacy type that is only used on test-systems and can be removed in future
  if (indicator.type === 'customEventBased') {
    return (
      <EventBasedIndicatorChart entity={entity} indicator={indicator} missingDataIndicator={missingDataIndicator} />
    );
  }

  return null;
}
