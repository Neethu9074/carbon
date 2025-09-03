/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { LogAlertRuleUnion, RuleWithThreshold } from '@instana/types/typeDefinitions';

import {
  createUnifiedThresholdForm,
  createThresholdRuleForm
} from 'in-alerting/smart-alerts/shared/form/thresholdForm';
import { LogAlertType } from 'in-alerting/smart-alerts/logs/data/blueprintConfig';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  ruleWithThreshold: RuleWithThreshold<LogAlertRuleUnion> | undefined, // supporting old javascript based code
  _alertType: LogAlertType, // Unused, but required for API compatibility with `updateMultiThresholdInForm`
  editMode?: boolean
): MapForm<any> {
  // Use the unified threshold form with log configuration
  return createUnifiedThresholdForm(ruleWithThreshold, {
    alertCategory: 'logs',
    alertType: _alertType,
    editMode
  });
}

// Export createThresholdRuleForm for backward compatibility
export { createThresholdRuleForm };

// Re-export helper function that may be used by existing log code
export function createLogThresholdRuleForm(
  ruleWithThreshold?: RuleWithThreshold<LogAlertRuleUnion>,
  editMode?: boolean
): MapForm<any> {
  return createThresholdRuleForm(ruleWithThreshold, 'logs', editMode);
}
