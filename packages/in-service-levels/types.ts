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
  TrafficBlueprintIndicator,
  SyntheticTest,
  Application,
  Website,
  ServiceLevelObjectiveConfiguration,
  TimeConfig,
  CorrectionConfiguration
} from '@instana/types';

import {
  SloTimeWindowTypes,
  sliThresholdOperators,
  sloStatuses,
  timeAggregationOptions
} from 'in-service-levels/constants';
import { ProductArea } from 'in-services/tracking/productAreas';
import { MetricDataSeries } from 'in-components/Chart/types';
import { PageName } from 'in-services/tracking/pageNames';

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
  id: string;
  label: string;
  deleted?: boolean;
}

export type SloBeaconTypes = 'httpRequest';

export type SloAggregationOptions = Record<AggregationType, string>;
export type TimeAggregationOptions = keyof typeof timeAggregationOptions;

export type SloMonitoredEntity = Application | Website | SyntheticTest;

export function isSliThresholdOperator(operator: string): operator is SLIThresholdOperator {
  return sliThresholdOperators.includes(operator as SLIThresholdOperator);
}

export interface SloTrackingMeta {
  productArea: ProductArea;
  pageName: PageName;
}

export type ConfigureDialogMode = 'NEW' | 'CLONE' | 'EDIT';

export interface CorrectionWindowListItem {
  configuration: CorrectionConfiguration;
  slos: ServiceLevelObjectiveConfiguration[];
}

export type SloStatus = (typeof sloStatuses)[number];

export interface SloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  entities: LabeledEntity[];
  status?: number;
  remainingBudget?: number;
  burnDown: MetricDataSeries;
  metricTimeConfig: TimeConfig;
  metricGranularity: number;
}
export interface SelectSloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  entities: LabeledEntity[];
}
