/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { generateUniqueShortId } from '@instana/utils';

import {
  AlertingAggregation,
  AlertingConditionOperator,
  MetricPattern,
  Nullish,
  ThresholdRule,
  LogicalOperator
} from 'in-types';
import { t } from 'in-i18n';

/** if no id is given, it creates an uuid */
export function createCustomThresholdBasedEventSpecification(
  id: string | Nullish,
  name = t('in-settings:tabs.newEvent'),
  entityType: string,
  query = '',
  triggering: boolean = false,
  description: string = '',
  expirationTime: number,
  enabled: boolean = true,
  metricName: string | undefined,
  metricPattern: MetricPattern | undefined,
  rollup: number,
  window: number,
  aggregation: AlertingAggregation | undefined,
  conditionOperator: AlertingConditionOperator,
  conditionValue: number,
  severity: number = 5
) {
  const rule = createThresholdRule(
    metricName,
    metricPattern,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity
  );
  return {
    id: id || generateUniqueShortId(),
    name,
    entityType,
    query,
    triggering,
    description,
    expirationTime,
    enabled,
    rules: [rule]
  };
}

export function createThresholdRule(
  metricName: string | undefined,
  metricPattern: MetricPattern | undefined,
  rollup: number,
  window: number,
  aggregation: AlertingAggregation | undefined,
  conditionOperator: AlertingConditionOperator,
  conditionValue: number,
  severity: number
): ThresholdRule {
  return {
    ruleType: 'threshold',
    metricName,
    metricPattern,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity
  };
}

export function createCustomMultiThresholdBasedEventSpecification(
  id: string | Nullish,
  entityType: string,
  expirationTime: number,
  rules: ThresholdRule[],
  ruleLogicalOperator: LogicalOperator,
  name = t('in-settings:tabs.newEvent'),
  description: string = '',
  query = '',
  triggering: boolean = false,
  enabled: boolean = true
) {
  return {
    id: id ?? generateUniqueShortId(),
    name,
    entityType,
    query,
    triggering,
    description,
    expirationTime,
    enabled,
    rules,
    ruleLogicalOperator
  };
}
