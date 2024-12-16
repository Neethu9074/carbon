/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertConfigWithMetadata,
  ServiceLevelsAlertRuleUnion,
  ServiceLevelsObjectiveAlertMetric,
  ErrorBudgetAlertMetric,
  AlertingDurationUnitType,
  ThresholdOperator
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
