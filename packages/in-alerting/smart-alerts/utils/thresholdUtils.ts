/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm, MapFormItems, UpdatedMapForm } from 'formalistic';

import {
  AdaptiveThresholdRule,
  Seasonality,
  SmartAlertThresholdRuleUnion,
  StaticBaselineThresholdRule,
  StaticThresholdRule,
  ThresholdType
} from 'in-types';
import {
  shiftDecimalLeft,
  shiftDecimalRight,
  increaseBy,
  increaseByForPercentageMetric
} from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { CRITICAL_THRESHOLD } from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';

export function mapToThresholdRuleInfo(rule: SmartAlertThresholdRuleUnion): ThresholdRuleInfo {
  switch (rule.type) {
    case STATIC_THRESHOLD:
      return {
        type: rule.type,
        seasonality: null,
        value: (rule as StaticThresholdRule).value
      };
    case HISTORIC_BASELINE:
      rule = rule as StaticBaselineThresholdRule;
      return {
        type: rule.type,
        seasonality: rule.seasonality,
        value: rule.deviationFactor
      };
    case ADAPTIVE_BASELINE:
      return {
        type: rule.type,
        seasonality: null,
        value: (rule as AdaptiveThresholdRule).deviationFactor
      };
    default:
      throw new Error(`Unknown threshold type`);
  }
}

export interface ThresholdRuleInfo {
  type: ThresholdType;
  seasonality: Seasonality | null;
  value: number;
}

export function createRuleWithThreshold(
  warningThresholdField: MapForm<any>,
  criticalThresholdField: MapForm<any>,
  rule: any,
  baselineEnabled: boolean,
  defaultOperator: any,
  isSimpleMode: boolean
) {
  return {
    rule: rule.toJS(),
    thresholdOperator: defaultOperator,
    thresholds: {
      WARNING: {
        value:
          warningThresholdField?.get('value')?.value ??
          (warningThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null),
        type: baselineEnabled
          ? isSimpleMode
            ? HISTORIC_BASELINE
            : warningThresholdField?.get('type')?.value
          : STATIC_THRESHOLD,
        deviationFactor: warningThresholdField?.get('deviationFactor')?.value ?? defaultDeviationFactor,
        seasonality: warningThresholdField?.get('seasonality')?.value ?? null,
        baseline: warningThresholdField?.get('baseline')?.value ?? null,
        isCheckboxSelected: warningThresholdField.get('isCheckboxSelected')?.value
      },
      CRITICAL: {
        value:
          criticalThresholdField?.get('value')?.value ??
          (criticalThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null),
        type: baselineEnabled
          ? isSimpleMode
            ? HISTORIC_BASELINE
            : criticalThresholdField?.get('type')?.value
          : STATIC_THRESHOLD,
        deviationFactor: criticalThresholdField?.get('deviationFactor')?.value ?? defaultDeviationFactor,
        seasonality: criticalThresholdField?.get('seasonality')?.value ?? null,
        baseline: criticalThresholdField?.get('baseline')?.value ?? null,
        isCheckboxSelected: criticalThresholdField.get('isCheckboxSelected')?.value
      }
    }
  };
}

export function populateRulesInConfig(alertConfig: any) {
  const ruleWithThreshold = alertConfig?.rules?.[0];

  // When creating the thresholdForm, both the warning and critical threshold fields are required.
  // However, the alertConfig we receive as JSON from the backend may include either both thresholds or only one,
  // depending on what the user configured. If only one threshold (either warning or critical) is present,
  // we need to initialize the missing threshold with placeholder (dummy) values. The missing threshold should
  // have the same type (e.g., STATIC_THRESHOLD, HISTORIC_BASELINE or ADAPTIVE_BASELINE) as the configured threshold.
  if (ruleWithThreshold?.thresholds) {
    const { WARNING, CRITICAL } = ruleWithThreshold.thresholds;

    const initializeThreshold = (referenceThreshold: any, isCheckboxSelected: boolean) => ({
      ...referenceThreshold,
      value: null,
      deviationFactor: defaultDeviationFactor,
      isCheckboxSelected
    });

    const thresholds = {
      // If WARNING exists, retain its values and set 'isCheckboxSelected' to true by default.
      // Otherwise, initialize WARNING based on CRITICAL's structure with placeholder values.
      WARNING: WARNING
        ? { ...WARNING, isCheckboxSelected: WARNING?.isCheckboxSelected ?? true }
        : initializeThreshold(CRITICAL, false),

      // If CRITICAL exists, retain its values and set 'isCheckboxSelected' to true by default.
      // Otherwise, initialize CRITICAL based on WARNING's structure with placeholder values.
      CRITICAL: CRITICAL
        ? { ...CRITICAL, isCheckboxSelected: CRITICAL?.isCheckboxSelected ?? true }
        : initializeThreshold(WARNING, false)
    };

    return {
      ...alertConfig,
      rules: [
        {
          ...ruleWithThreshold,
          thresholds
        }
      ]
    };
  }

  return alertConfig;
}

export interface SetValidNextValueProps {
  isChecked: boolean;
  thresholdValue: number;
  thresholdType: string;
  updateForm: (form: MapForm<any>) => void;
  updatedThresholdValue: (
    targetValue: number | null,
    thresholdType: string
  ) => UpdatedMapForm<any, string, UpdatedMapForm<MapFormItems, string, UpdatedMapForm<any, string, Field<any>>>>;
  percentageMetric: boolean;
  operator: string;
}

export function setValidNextValue({
  isChecked,
  thresholdValue,
  thresholdType,
  updateForm,
  updatedThresholdValue,
  percentageMetric,
  operator
}: SetValidNextValueProps) {
  if (!isChecked) {
    // update the field to null if threshold is unchecked
    return updateForm(updatedThresholdValue(null, thresholdType));
  }

  const nextValue = getNextValue(percentageMetric, thresholdValue, operator, thresholdType);
  return updateForm(updatedThresholdValue(Number(nextValue), thresholdType));
}

export function getNextValue(
  percentageMetric: boolean,
  thresholdValue: number,
  operator: string,
  thresholdType: string
) {
  if (thresholdValue === null) {
    // if warning threshold is not enabled, set the value as 0 for the critical field
    return 0;
  }

  let nextValue: string | number | null;
  if (percentageMetric) {
    if (thresholdValue === 0) {
      nextValue = getAdjustedValue(0, operator, increaseByForPercentageMetric, thresholdType);
    } else if (Math.floor(thresholdValue) === thresholdValue) {
      nextValue = getAdjustedValue(thresholdValue, operator, increaseByForPercentageMetric, thresholdType);
    } else {
      // if warning threshold is a decimal number
      const valueShifted = shiftDecimalRight(thresholdValue, 2, percentageMetric);
      const incremented = valueShifted
        ? getAdjustedValue(Number(valueShifted), operator, increaseBy, thresholdType)
        : 0;
      nextValue = shiftDecimalLeft(incremented, 2, percentageMetric);
    }
  } else {
    nextValue = getAdjustedValue(thresholdValue, operator, increaseBy, thresholdType);
  }
  return nextValue;
}

function getAdjustedValue(value: number, operator: string, increaseBy: number, thresholdType: string) {
  switch (operator) {
    case '>':
    case '>=':
      return thresholdType === CRITICAL_THRESHOLD ? value + increaseBy : value < 1 ? 0 : value - increaseBy;
    case '<':
    case '<=':
      return thresholdType === CRITICAL_THRESHOLD ? (value < 1 ? 0 : value - increaseBy) : value + increaseBy;
    default:
      throw Error('unexpected error : value cannot be shifted');
  }
}
