/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelIndicatorUnion, SloEntityUnion, TimeConfig } from '@instana/types';
import { isCustomEventBasedSli, isEventBasedSli } from '@instana/types/typeDefinitions';

import TimeBasedAvailabilityIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedAvailabilityIndicatorChart';
import TimeBasedLatencyIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/TimeBasedLatencyIndicatorChart';
import EventBasedIndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/EventBasedIndicatorChart';
import {
  isTimeBasedAvailabilityBlueprintIndicator,
  isTimeBasedLatencyBlueprintIndicator
} from 'in-service-levels/types';

export interface IndicatorChartProps<IndicatorType = ServiceLevelIndicatorUnion> {
  entity: SloEntityUnion;
  indicator: IndicatorType;
  timeConfig: TimeConfig;
}

export default function IndicatorChart({ indicator, entity, timeConfig }: IndicatorChartProps) {
  if (isTimeBasedLatencyBlueprintIndicator(indicator)) {
    return <TimeBasedLatencyIndicatorChart indicator={indicator} entity={entity} timeConfig={timeConfig} />;
  }
  if (isTimeBasedAvailabilityBlueprintIndicator(indicator)) {
    return <TimeBasedAvailabilityIndicatorChart entity={entity} indicator={indicator} timeConfig={timeConfig} />;
  }
  if (isEventBasedSli(indicator) || isCustomEventBasedSli(indicator)) {
    return <EventBasedIndicatorChart entity={entity} indicator={indicator} timeConfig={timeConfig} />;
  }

  return null;
}
