/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isTimeBasedSli, ServiceLevelIndicatorUnion, TimeBasedSli, BeaconType, ServiceLevelObjectiveConfiguration } from '@instana/types';

export interface LabeledEntity {
  label: string;
}

export type TimeBasedLatencyBlueprintIndicator = TimeBasedSli & { blueprint: 'latency' };
export type TimeBasedAvailabilityBlueprintIndicator = TimeBasedSli & { blueprint: 'availability' };

export function isTimeBasedLatencyBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is TimeBasedLatencyBlueprintIndicator {
  return isTimeBasedSli(indicator) && indicator.blueprint === 'latency';
}

export function isTimeBasedAvailabilityBlueprintIndicator(
  indicator: ServiceLevelIndicatorUnion
): indicator is TimeBasedAvailabilityBlueprintIndicator {
  return isTimeBasedSli(indicator) && indicator.blueprint === 'availability';
}

export type SloBeaconTypes = Extract<BeaconType, 'httpRequest' | 'pageLoad' | 'custom'>;

export type SloConfigType = Partial<ServiceLevelObjectiveConfiguration>;
