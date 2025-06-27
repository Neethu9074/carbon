/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';

import {
  AdaptiveThresholdRule,
  MobileAppAlertRuleUnion,
  StaticBaselineThresholdRule,
  StaticThresholdRule,
  WebsiteAlertRuleUnion
} from '@instana/types';

import {
  HistoricBaselineConfig,
  isStaticBaselineThresholdRule,
  RuleWithThreshold,
  isStaticThresholdRule,
  isAdaptiveThresholdRule
} from 'in-types';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export interface AdaptabilityBaselineThreshold extends AdaptiveThresholdRule {
  readonly baseline?: number[][];
}

export default function createThresholdForm(
  ruleWithThreshold: RuleWithThreshold<WebsiteAlertRuleUnion> | RuleWithThreshold<MobileAppAlertRuleUnion> | undefined, // supporting old javascript based code
  alertType: WebsitesAlertType | MobileAlertType,
  editMode?: boolean
): MapForm<any> {
  if (!ruleWithThreshold) {
    return createBaselineEnabledForm();
  }

  switch (alertType) {
    case 'specificJsError':
      return createStaticThresholdForm(ruleWithThreshold);
    default:
      return createBaselineEnabledForm(ruleWithThreshold, editMode);
  }
}

function createBaselineEnabledForm(
  ruleWithThreshold?: RuleWithThreshold<WebsiteAlertRuleUnion> | RuleWithThreshold<MobileAppAlertRuleUnion> | undefined,
  editMode?: boolean
): MapForm<any> {
  const thresholdRule = ruleWithThreshold?.thresholds;

  //If neither WARNING nor CRITICAL thresholds are defined, it defaults to creating a static threshold form.
  if (!thresholdRule?.WARNING && !thresholdRule?.CRITICAL) {
    return createStaticThresholdForm(ruleWithThreshold);
  }

  if (thresholdRule?.WARNING) {
    if (!ruleWithThreshold || isStaticThresholdRule(thresholdRule?.WARNING)) {
      return createStaticThresholdForm(ruleWithThreshold, editMode);
    }
    if (isStaticBaselineThresholdRule(thresholdRule?.WARNING)) {
      return createHistoricBaselineForm(ruleWithThreshold, editMode);
    }
    if (isAdaptiveThresholdRule(thresholdRule?.WARNING)) {
      return createAdaptiveBaselineForm(ruleWithThreshold);
    }
  }

  if (thresholdRule?.CRITICAL) {
    if (!ruleWithThreshold || isStaticThresholdRule(thresholdRule?.CRITICAL)) {
      return createStaticThresholdForm(ruleWithThreshold, editMode);
    }
    if (isStaticBaselineThresholdRule(thresholdRule?.CRITICAL)) {
      return createHistoricBaselineForm(ruleWithThreshold, editMode);
    }
    if (isAdaptiveThresholdRule(thresholdRule?.CRITICAL)) {
      return createAdaptiveBaselineForm(ruleWithThreshold);
    }
  }

  throw new Error(`Unknown threshold type.`);
}

function createStaticThresholdForm(
  ruleWithThreshold?: RuleWithThreshold<WebsiteAlertRuleUnion> | RuleWithThreshold<MobileAppAlertRuleUnion> | undefined,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as StaticThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as StaticThresholdRule;

  return createMapForm({
    validator: validateStaticThresholdMapForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      warningThreshold: createStaticThresholdMapForm(warningThreshold, editMode),
      criticalThreshold: createStaticThresholdMapForm(criticalThreshold, editMode)
    }
  });
}

function createStaticThresholdMapForm(threshold?: StaticThresholdRule, editMode?: boolean): MapForm<any> {
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
        value: (threshold as any)?.isCheckboxSelected === true ? threshold?.value ?? 0 : null
      }).setTouched(editMode ? !isEmpty(threshold?.value) : false)
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      }).setTouched((threshold as any)?.isCheckboxSelected)
    );
}

function createHistoricBaselineForm(
  ruleWithThreshold?: RuleWithThreshold<WebsiteAlertRuleUnion> | RuleWithThreshold<MobileAppAlertRuleUnion> | undefined,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as HistoricBaselineConfig;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as HistoricBaselineConfig;
  const commonSeasonality = warningThreshold?.seasonality ?? criticalThreshold?.seasonality ?? DAILY;
  const commonBaseline = warningThreshold?.baseline ?? criticalThreshold?.baseline ?? null;

  return createMapForm({
    validator: validateForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      warningThreshold: createHistoricBaselineMapForm(
        warningThreshold,
        commonSeasonality,
        commonBaseline as BaselineDataSeries,
        editMode
      ),
      criticalThreshold: createHistoricBaselineMapForm(
        criticalThreshold,
        commonSeasonality,
        commonBaseline as BaselineDataSeries,
        editMode
      )
    }
  });
}

function createHistoricBaselineMapForm(
  threshold?: StaticBaselineThresholdRule,
  seasonality: string = DAILY,
  baseline?: BaselineDataSeries,
  editMode?: boolean
): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? HISTORIC_BASELINE
      })
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      })
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
                message: t('in-alerting:smartAlerts.websites.form.errorBaselineIsEmpty')
              }
            ];
          }
          return null;
        },
        value: baseline
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold?.deviationFactor
      }).setTouched(editMode ? (threshold as any)?.isCheckboxSelected : false)
    );
}

function createAdaptiveBaselineForm(
  ruleWithThreshold?: RuleWithThreshold<WebsiteAlertRuleUnion> | RuleWithThreshold<MobileAppAlertRuleUnion> | undefined
) {
  const thresholdRule = ruleWithThreshold?.thresholds;
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as AdaptiveThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as AdaptiveThresholdRule;

  const commonBaseline =
    (thresholdRule?.WARNING as AdaptabilityBaselineThreshold)?.baseline ??
    (thresholdRule?.CRITICAL as AdaptabilityBaselineThreshold)?.baseline ??
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
      warningThreshold: createAdaptiveBaselineMapForm(warningThreshold),
      criticalThreshold: createAdaptiveBaselineMapForm(criticalThreshold)
    }
  });
}

function createAdaptiveBaselineMapForm(threshold?: AdaptiveThresholdRule): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? ADAPTIVE_BASELINE
      })
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold?.deviationFactor ?? defaultDeviationFactor
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
  } else if (hasWarningThreshold || hasCriticalThreshold) {
    const thresholdValue = hasWarningThreshold ? warningThresholdValue : criticalThresholdValue;
    if (typeof thresholdValue !== 'number' || thresholdValue < 0) {
      return [
        {
          severity: 'error',
          message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideANumberGreaterEqualsToZero')
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
