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
  AlertingDurationUnitType
} from '@instana/types';

export type SloAlertTypes = ServiceLevelsAlertRuleUnion['alertType'];
export type SloAlertMetricTypes = ErrorBudgetAlertMetric | ServiceLevelsObjectiveAlertMetric;
export type SloAlertDurationUnitTypes = Extract<AlertingDurationUnitType, 'minute' | 'hour' | 'day'>;

export function isServiceLevelAlertConfigWithMetaData(
  sloAlertConfig: ServiceLevelsAlertConfig | ServiceLevelsAlertConfigWithMetadata
): sloAlertConfig is ServiceLevelsAlertConfigWithMetadata {
  return 'id' in sloAlertConfig && sloAlertConfig.id != null;
}
