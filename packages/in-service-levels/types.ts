/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AggregationType,
  AvailabilityBlueprintIndicator,
  CustomBlueprintIndicator,
  LatencyBlueprintIndicator,
  SLIThresholdOperator,
  ServiceLevelIndicatorUnion,
  TrafficBlueprintIndicator
} from '@instana/types';

import { SloTimeWindowTypes, sliThresholdOperators, timeAggregationOptions } from 'in-service-levels/constants';

export type AggregatedServiceLevelIndicator = AvailabilityBlueprintIndicator | LatencyBlueprintIndicator;

export function isAggregatedServiceLevelIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is AggregatedServiceLevelIndicator {
  return indicator.blueprint === 'availability' || indicator.blueprint === 'latency';
}

export function isLatencyBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is LatencyBlueprintIndicator {
  return indicator.blueprint === 'latency';
}

export function isAvailabilityBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is AvailabilityBlueprintIndicator {
  return indicator.blueprint === 'availability';
}

export function isCustomBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is CustomBlueprintIndicator {
  return indicator.blueprint === 'custom';
}

export function isTrafficBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is TrafficBlueprintIndicator {
  return indicator.blueprint === 'traffic';
}

export function isAvailableTimeWindowType(timeWindowType: any): timeWindowType is AvailableTimeWindowTypes {
  return timeWindowType && Object.values(SloTimeWindowTypes).includes(timeWindowType);
}

export type AvailableTimeWindowTypes = keyof typeof SloTimeWindowTypes;

export interface LabeledEntity {
  label: string;
  deleted?: boolean;
}

export type SloBeaconTypes = 'httpRequest' | 'pageLoad' | 'custom';

export type SloAggregationOptions = Record<AggregationType, string>;
export type TimeAggregationOptions = keyof typeof timeAggregationOptions;

export function isSliThresholdOperator(operator: string): operator is SLIThresholdOperator {
  return sliThresholdOperators.includes(operator as SLIThresholdOperator);
}
