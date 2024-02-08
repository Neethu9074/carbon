/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelIndicatorUnion, SloEntityUnion } from '@instana/types';

import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';

export interface IndicatorChartProps<IndicatorType = ServiceLevelIndicatorUnion> {
  entity: SloEntityUnion;
  indicator: IndicatorType;
}

export default function IndicatorChart({ indicator, entity }: IndicatorChartProps) {
  if (indicator.blueprint === 'latency' && indicator.type === 'timeBased') {
    return <TimeBasedLatencyIndicatorChart indicator={indicator} entity={entity} />;
  }
  if (indicator.blueprint === 'availability' && indicator.type === 'timeBased') {
    return <TimeBasedAvailabilityIndicatorChart entity={entity} indicator={indicator} />;
  }
  if (indicator.type === 'eventBased') {
    return <EventBasedIndicatorChart entity={entity} indicator={indicator} />;
  }

  // @ts-expect-error customEventBased indicator is just a legacy type that is only used on test-systems and can be removed in future
  if (indicator.type === 'customEventBased') {
    return <EventBasedIndicatorChart entity={entity} indicator={indicator} />;
  }

  return null;
}
