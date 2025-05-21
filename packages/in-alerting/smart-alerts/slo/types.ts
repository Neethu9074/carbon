/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, ListForm, MapForm, MapPath } from 'formalistic';

import {
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertConfigWithMetadata,
  ServiceLevelsAlertRuleUnion,
  ServiceLevelsObjectiveAlertMetric,
  ErrorBudgetAlertMetric,
  AlertingDurationUnitType,
  ThresholdOperator,
  BurnRateAlertWindowType,
  CustomPayloadFieldUnion,
  SloEntityType
} from '@instana/types';

import { sloAlertThresholdOperators } from 'in-alerting/smart-alerts/slo/constants';

export type SloAlertTypes = ServiceLevelsAlertRuleUnion['alertType'];
export type SloAlertMetricTypes = ErrorBudgetAlertMetric | ServiceLevelsObjectiveAlertMetric;
export type SloAlertDurationUnitTypes = Extract<AlertingDurationUnitType, 'minute' | 'hour' | 'day'>;

export function isServiceLevelAlertConfigWithMetaData(
  sloAlertConfig: ServiceLevelsAlertConfig | ServiceLevelsAlertConfigWithMetadata
): sloAlertConfig is ServiceLevelsAlertConfigWithMetadata {
  return 'id' in sloAlertConfig && sloAlertConfig.id != null;
}

export function isSloAlertThresholdOperator(operator: string): operator is ThresholdOperator {
  return sloAlertThresholdOperators.includes(operator as ThresholdOperator);
}

// Alert form defintion

export type SloAlertRuleFormFields = {
  alertType: Field<ServiceLevelsAlertRuleUnion['alertType']>;
  metric: Field<ErrorBudgetAlertMetric | ServiceLevelsObjectiveAlertMetric>;
};

export type SloAlertTimeThresholdFields = {
  expiry: Field<number>;
  timeWindow: Field<number>;
};
export type BurnRateAlertType = 'single' | 'multi';
export type BurnRateThresholdFields = {
  operator: Field<ThresholdOperator>;
  value: Field<number>;
  lastUpdated: Field<number>;
};

export type BurnRateAlertFormFields = {
  duration: Field<number>;
  durationUnitType: Field<AlertingDurationUnitType>;
  alertWindowType: Field<BurnRateAlertWindowType>;
  threshold: MapForm<BurnRateThresholdFields>;
};
export type SloAlertFormFields = {
  entityType: Field<SloEntityType | undefined>;
  sloIds: Field<string[]>;
  rule: MapForm<SloAlertRuleFormFields>;
  threshold: Field<number | undefined>;
  operator: Field<ThresholdOperator>;
  timeThreshold: MapForm<SloAlertTimeThresholdFields>;
  alertChannelIds: Field<string[]>;
  severity: Field<number>;
  name: Field<string>;
  description: Field<string>;
  triggering: Field<boolean>;
  customPayloadFields: ListForm<Field<CustomPayloadFieldUnion>[]>;
  id: Field<string>;
  burnRateAlertType: Field<BurnRateAlertType>;
  burnRateConfig: ListForm<MapForm<BurnRateAlertFormFields>[]>;
};
export type SloAlertFormPath = MapPath<SloAlertFormFields>;
export interface SloAlertForm extends MapForm<SloAlertFormFields> {}
