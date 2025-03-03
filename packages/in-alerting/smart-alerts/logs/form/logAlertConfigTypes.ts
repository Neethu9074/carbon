/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { LogAlertRuleUnion, RuleWithThreshold, ThresholdConfigUnion } from '@instana/types/typeDefinitions';
import { LogAlertConfigWithMetadata } from '@instana/types';

import { LogAlertConfig } from 'in-types';

export interface LogSmartAlertConfig extends LogAlertConfig {
  rules: RuleWithThreshold<LogAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
}

export interface LogSmartAlertConfigWithMetadata extends LogAlertConfigWithMetadata {
  rules: RuleWithThreshold<LogAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
}
