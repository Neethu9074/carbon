/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import { InfraAlertRuleUnion, RuleWithThreshold } from '@instana/types/typeDefinitions';

import {
  createUnifiedThresholdForm,
  createThresholdRuleForm
} from 'in-alerting/smart-alerts/shared/form/thresholdForm';
import { InfraAlertType } from 'in-alerting/smart-alerts/infrastructure/data/blueprintConfig';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  ruleWithThreshold: RuleWithThreshold<InfraAlertRuleUnion> | undefined, // supporting old javascript based code,
  _alertType: InfraAlertType, // Unused, but required for API compatibility with `updateMultiThresholdInForm`
  editMode?: boolean
): MapForm<any> {
  // Use the unified threshold form with infrastructure configuration
  return createUnifiedThresholdForm(ruleWithThreshold, {
    alertCategory: 'infrastructure',
    alertType: _alertType,
    editMode
  });
}

// Export createThresholdRuleForm for backward compatibility
export { createThresholdRuleForm };

// Re-export helper function that may be used by existing infrastructure code
export function createInfraThresholdRuleForm(
  ruleWithThreshold?: RuleWithThreshold<InfraAlertRuleUnion>,
  editMode?: boolean
): MapForm<any> {
  return createThresholdRuleForm(ruleWithThreshold, 'infrastructure', editMode);
}
