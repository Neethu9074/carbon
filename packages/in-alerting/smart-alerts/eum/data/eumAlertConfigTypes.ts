/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  RuleWithThreshold,
  ThresholdConfigUnion,
  MobileAppAlertConfig,
  MobileAppAlertRuleUnion,
  MobileAppAlertConfigWithMetadata,
  Severity,
  WebsiteAlertConfig,
  WebsiteAlertRuleUnion,
  WebsiteAlertConfigWithMetadata
} from '@instana/types';

export interface MobileAppSmartAlertConfig extends MobileAppAlertConfig {
  rule: MobileAppAlertRuleUnion;
  rules: RuleWithThreshold<MobileAppAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}

export interface MobileAppSmartAlertConfigWithMetadata extends MobileAppAlertConfigWithMetadata {
  rule: MobileAppAlertRuleUnion;
  rules: RuleWithThreshold<MobileAppAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}

export interface WebsiteSmartAlertConfig extends WebsiteAlertConfig {
  rule: WebsiteAlertRuleUnion;
  rules: RuleWithThreshold<WebsiteAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}

export interface WebsiteSmartAlertConfigWithMetadata extends WebsiteAlertConfigWithMetadata {
  rule: WebsiteAlertRuleUnion;
  rules: RuleWithThreshold<WebsiteAlertRuleUnion>[];
  severity: number;
  threshold: ThresholdConfigUnion;
  alertChannelIds: string[];
  alertChannels: { [P in Severity]?: string[] };
}
