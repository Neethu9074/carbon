/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import {
  AdaptiveBaselineData,
  ThresholdOperator,
  isStaticThresholdRule,
  RuleWithThreshold,
  SmartAlertThresholdRule,
  ApplicationAlertRuleUnion,
  StaticThresholdRule,
  isStaticBaselineThresholdRule,
  ThresholdData,
  StaticBaselineThresholdRule,
  Seasonality,
  isAdaptiveBaselineData
} from '@instana/types/typeDefinitions';

import { STATIC_THRESHOLD, HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;
type Severity = 'error';
type ValidationMessage = {
  severity: Severity;
  message: string;
};
type ValidationResult = ValidationMessage[] | null;

export default function createThresholdForm(
  ruleWithThreshold: RuleWithThreshold<ApplicationAlertRuleUnion> | undefined,
  alertType: ApplicationAlertType,
  editMode?: boolean,
  isSimpleMode?: boolean
): MapForm<any> {
  if (!ruleWithThreshold) {
    return createThresholdRuleForm();
  }

  switch (alertType) {
    case 'logs':
      return createAdaptiveOrStaticThresholdRuleForm(ruleWithThreshold, editMode, isSimpleMode);
    default:
      return createThresholdRuleForm(ruleWithThreshold, editMode, isSimpleMode);
  }
}

function createAdaptiveOrStaticThresholdRuleForm(
  ruleWithThreshold: RuleWithThreshold<ApplicationAlertRuleUnion>,
  editMode?: boolean,
  isSimpleMode?: boolean
): MapForm<any> {
  const thresholdRule = ruleWithThreshold?.thresholds;

  if (
    isAdaptiveBaselineData(
      toThresholdData(thresholdRule?.WARNING as SmartAlertThresholdRule, ruleWithThreshold?.thresholdOperator)
    ) ||
    isAdaptiveBaselineData(
      toThresholdData(thresholdRule?.CRITICAL as SmartAlertThresholdRule, ruleWithThreshold?.thresholdOperator)
    )
  ) {
    return createAdaptiveBaselineForm(ruleWithThreshold, editMode);
  }
  return createStaticThresholdForm(ruleWithThreshold, editMode, isSimpleMode);
}

// Helper to convert threshold rule to threshold data
function toThresholdData(thresholdRule: SmartAlertThresholdRule, operator: ThresholdOperator = '>='): ThresholdData {
  return {
    type: thresholdRule?.type,
    operator
  };
}

function createThresholdRuleForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  editMode?: boolean,
  isSimpleMode?: boolean
): MapForm<any> {
  const thresholdRule = ruleWithThreshold?.thresholds;

  //If neither WARNING nor CRITICAL thresholds are defined, it defaults to creating a static threshold form.
  if (!thresholdRule?.WARNING && !thresholdRule?.CRITICAL) {
    return createStaticThresholdForm(ruleWithThreshold, editMode, isSimpleMode);
  }

  // Based on the thresholdType, we are creating both WARNING and CRITICAL threshold fields.
  // To ensure a consistent form structure, the thresholdType should be the same for both fields
  // (i.e., both WARNING and CRITICAL should have the same type, such as Static, Static Baseline, or Adaptive Baseline).
  if (thresholdRule?.WARNING) {
    if (isStaticThresholdRule(thresholdRule.WARNING)) {
      return createStaticThresholdForm(ruleWithThreshold, editMode, isSimpleMode);
    }
    if (isStaticBaselineThresholdRule(thresholdRule.WARNING)) {
      return createStaticBaselineForm(ruleWithThreshold, editMode, isSimpleMode);
    }
    if (isAdaptiveBaselineData(toThresholdData(thresholdRule.WARNING, ruleWithThreshold?.thresholdOperator))) {
      return createAdaptiveBaselineForm(ruleWithThreshold, editMode);
    }
  }

  if (thresholdRule?.CRITICAL) {
    if (isStaticThresholdRule(thresholdRule.CRITICAL)) {
      return createStaticThresholdForm(ruleWithThreshold, editMode, isSimpleMode);
    }
    if (isStaticBaselineThresholdRule(thresholdRule.CRITICAL)) {
      return createStaticBaselineForm(ruleWithThreshold, editMode, isSimpleMode);
    }
    if (isAdaptiveBaselineData(toThresholdData(thresholdRule.CRITICAL, ruleWithThreshold?.thresholdOperator))) {
      return createAdaptiveBaselineForm(ruleWithThreshold, editMode);
    }
  }

  throw new Error('Unknown threshold type.');
}

function createThresholdMapForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  threshold?: SmartAlertThresholdRule | ThresholdData,
  seasonality?: Seasonality,
  baseline?: BaselineDataSeries,
  editMode?: boolean,
  isSimpleMode?: boolean
): MapForm<any> {
  if (!threshold || isStaticThresholdRule(threshold)) {
    return createStaticThresholdMapForm(threshold, editMode, isSimpleMode);
  }
  if (isStaticBaselineThresholdRule(threshold)) {
    return createStaticBaselineMapForm(ruleWithThreshold, threshold, seasonality, baseline, editMode, isSimpleMode);
  }
  if (isAdaptiveBaselineData(threshold as ThresholdData)) {
    return createAdaptiveBaselineMapForm(ruleWithThreshold, threshold as AdaptiveBaselineData, editMode);
  }
  throw new Error(`Unknown threshold type ${threshold?.type}.`);
}

function createStaticThresholdForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  editMode?: boolean,
  isSimpleMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL;

  return createMapForm({
    validator: validateStaticThresholdMapForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      warningThreshold: createThresholdMapForm(
        ruleWithThreshold,
        warningThreshold,
        undefined,
        undefined,
        editMode,
        isSimpleMode
      ),
      criticalThreshold: createThresholdMapForm(
        ruleWithThreshold,
        criticalThreshold,
        undefined,
        undefined,
        editMode,
        isSimpleMode
      )
    }
  });
}

function createStaticThresholdMapForm(
  threshold?: StaticThresholdRule,
  editMode: boolean = false,
  isSimpleMode: boolean = false
): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? STATIC_THRESHOLD
      })
    )
    .put(
      'value',
      createField({
        value: threshold?.value ?? (isSimpleMode ? null : (threshold as any)?.isCheckboxSelected === true ? 0 : null)
      }).setTouched(editMode ? !isEmpty(threshold?.value) : false)
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: threshold?.value != null
      })
    );
}

function validateStaticThresholdMapForm({
  operator,
  warningThreshold,
  criticalThreshold
}: {
  operator: Field<string>;
  warningThreshold: MapForm<any>;
  criticalThreshold: MapForm<any>;
}): ValidationResult {
  const warningThresholdValue = warningThreshold.get('value')?.value;
  const hasWarningThreshold = !isEmpty(warningThresholdValue);
  const criticalThresholdValue = criticalThreshold.get('value')?.value;
  const hasCriticalThreshold = !isEmpty(criticalThresholdValue);

  if (hasWarningThreshold && hasCriticalThreshold) {
    const operatorValue = operator?.value;

    if ((operatorValue === '<' || operatorValue === '<=') && warningThresholdValue <= criticalThresholdValue) {
      return [
        {
          severity: 'error',
          message: t('in-alerting:smartAlerts.form.warningThresholdValidator')
        }
      ];
    } else if ((operatorValue === '>' || operatorValue === '>=') && warningThresholdValue >= criticalThresholdValue) {
      return [
        {
          severity: 'error',
          message: t('in-alerting:smartAlerts.form.criticalThresholdValidator')
        }
      ];
    }
  }

  if (!hasWarningThreshold && !hasCriticalThreshold) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.applications.form.selectAtLeastOneThreshold')
      }
    ];
  }

  return null;
}

function createStaticBaselineForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  editMode: boolean = false,
  isSimpleMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as StaticBaselineThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as StaticBaselineThresholdRule;
  const commonSeasonality = warningThreshold?.seasonality ?? criticalThreshold?.seasonality ?? DAILY;
  const commonBaseline = warningThreshold?.baseline ?? criticalThreshold?.baseline ?? null;

  return createMapForm({
    validator: validateForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      warningThreshold: createThresholdMapForm(
        ruleWithThreshold,
        warningThreshold,
        commonSeasonality,
        commonBaseline as BaselineDataSeries,
        editMode,
        isSimpleMode
      ),
      criticalThreshold: createThresholdMapForm(
        ruleWithThreshold,
        criticalThreshold,
        commonSeasonality,
        commonBaseline as BaselineDataSeries,
        editMode,
        isSimpleMode
      )
    }
  });
}

function createStaticBaselineMapForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  threshold?: StaticBaselineThresholdRule,
  seasonality: string = DAILY,
  baseline?: BaselineDataSeries,
  editMode: boolean = false,
  isSimpleMode: boolean = false
): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? HISTORIC_BASELINE
      })
    )
    .put(
      'deviationFactor',
      createField({
        value:
          threshold?.deviationFactor ??
          (threshold === ruleWithThreshold?.thresholds?.WARNING && !editMode ? defaultDeviationFactor : 0)
      }).setTouched(editMode ? !isEmpty(threshold?.deviationFactor) : false)
    )
    .put(
      'seasonality',
      createField({
        value: seasonality
      })
    )
    .put(
      'baseline',
      createField({
        validator: array => {
          if (array?.length === 0) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.thresholdFormBaselineIsEmpty')
              }
            ];
          }
          return null;
        },
        value: baseline
      })
    )
    .put(
      'isCheckboxSelected',
      createField({
        value:
          threshold?.deviationFactor != 0 &&
          (isSimpleMode ||
            (threshold as any)?.isCheckboxSelected === undefined ||
            (threshold as any)?.isCheckboxSelected)
      })
    );
}

function createAdaptiveBaselineForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  editMode: boolean = false
): MapForm<any> {
  const thresholdRule = ruleWithThreshold?.thresholds;
  const warningThresholdFields = thresholdRule?.WARNING;
  const criticalThresholdFields = thresholdRule?.CRITICAL;
  const commonBaseline =
    (thresholdRule?.WARNING as AdaptiveBaselineData)?.baseline ??
    (thresholdRule?.CRITICAL as AdaptiveBaselineData)?.baseline ??
    [];

  return createMapForm({
    validator: validateForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      baseline: createField({
        value: commonBaseline
      }),
      warningThreshold: createThresholdMapForm(
        ruleWithThreshold,
        warningThresholdFields,
        undefined,
        undefined,
        editMode
      ),
      criticalThreshold: createThresholdMapForm(
        ruleWithThreshold,
        criticalThresholdFields,
        undefined,
        undefined,
        editMode
      )
    }
  });
}

function createAdaptiveBaselineMapForm(
  ruleWithThreshold?: RuleWithThreshold<ApplicationAlertRuleUnion>,
  threshold?: AdaptiveBaselineData,
  editMode: boolean = false
): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? ADAPTIVE_BASELINE
      })
    )
    .put(
      'deviationFactor',
      createField({
        value:
          threshold?.deviationFactor ??
          (threshold === ruleWithThreshold?.thresholds?.WARNING && !editMode ? defaultDeviationFactor : 0)
      }).setTouched(editMode ? !isEmpty(threshold?.deviationFactor) : false)
    )
    .put(
      'isCheckboxSelected',
      createField({
        value:
          threshold?.deviationFactor != 0 &&
          ((threshold as any)?.isCheckboxSelected === undefined || (threshold as any)?.isCheckboxSelected)
      })
    );
}

function validateForm({
  warningThreshold,
  criticalThreshold
}: {
  warningThreshold: MapForm<any>;
  criticalThreshold: MapForm<any>;
}): ValidationResult {
  const warningDeviationFactor = warningThreshold.get('deviationFactor')?.value;
  const warningCheckboxSelected = warningThreshold.get('isCheckboxSelected')?.value;
  const criticalDeviationFactor = criticalThreshold.get('deviationFactor')?.value;
  const criticalCheckboxSelected = criticalThreshold.get('isCheckboxSelected')?.value;

  if (warningCheckboxSelected && criticalCheckboxSelected) {
    if (warningDeviationFactor >= criticalDeviationFactor) {
      return [
        {
          severity: 'error',
          message: t('in-alerting:smartAlerts.form.sensitivityValidator')
        }
      ];
    }
  }

  if (!warningCheckboxSelected && !criticalCheckboxSelected) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.applications.form.selectAtLeastOneSensitivity')
      }
    ];
  }

  return null;
}
