/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { InfraAlertRuleUnion, RuleWithThreshold, Severity, ThresholdConfigUnion } from '@instana/types/typeDefinitions';
import { InfraAlertConfigWithMetadata } from '@instana/types';

import { InfraAlertConfig } from 'in-types';

export interface InfraSmartAlertConfig extends InfraAlertConfig {
  rule: InfraAlertRuleUnion;
  rules: RuleWithThreshold<InfraAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}

export interface InfraSmartAlertConfigWithMetadata extends InfraAlertConfigWithMetadata {
  rule: InfraAlertRuleUnion;
  rules: RuleWithThreshold<InfraAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}
