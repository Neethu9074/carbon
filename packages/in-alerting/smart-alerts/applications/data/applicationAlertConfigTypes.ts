/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  ApplicationAlertConfigWithMetadata,
  ApplicationAlertRuleUnion,
  RuleWithThreshold,
  ThresholdConfigUnion,
  ApplicationAlertConfig,
  GlobalApplicationsAlertConfig,
  GlobalApplicationsAlertConfigWithMetadata
} from '@instana/types';

export interface ApplicationSmartAlertConfig extends ApplicationAlertConfig {
  rule: ApplicationAlertRuleUnion;
  threshold: ThresholdConfigUnion;
  severity: number;
  rules: RuleWithThreshold<ApplicationAlertRuleUnion>[];
}

export interface ApplicationSmartAlertConfigWithMetadata extends ApplicationAlertConfigWithMetadata {
  rule: ApplicationAlertRuleUnion;
  threshold: ThresholdConfigUnion;
  severity: number;
  rules: RuleWithThreshold<ApplicationAlertRuleUnion>[];
}

export interface GlobalApplicationsSmartAlertConfig extends GlobalApplicationsAlertConfig {
  rule: ApplicationAlertRuleUnion;
  threshold: ThresholdConfigUnion;
  severity: number;
  rules: RuleWithThreshold<ApplicationAlertRuleUnion>[];
}

export interface GlobalApplicationsSmartAlertConfigWithMetadata extends GlobalApplicationsAlertConfigWithMetadata {
  rule: ApplicationAlertRuleUnion;
  threshold: ThresholdConfigUnion;
  severity: number;
  rules: RuleWithThreshold<ApplicationAlertRuleUnion>[];
}
