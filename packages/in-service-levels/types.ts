/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AvailabilityBlueprintIndicator,
  CustomBlueprintIndicator,
  LatencyBlueprintIndicator,
  ServiceLevelIndicatorUnion
} from '@instana/types';

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

export interface LabeledEntity {
  label: string;
  deleted?: boolean;
}

export type SloBeaconTypes = 'httpRequest' | 'pageLoad' | 'custom';
