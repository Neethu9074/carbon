/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import {
  InfraAlertRuleUnion,
  isStaticThresholdRule,
  RuleWithThreshold,
  SmartAlertThresholdRule,
  StaticThresholdRule
} from '@instana/types/typeDefinitions';

import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

export default function createThresholdForm(
  ruleWithThreshold: RuleWithThreshold<InfraAlertRuleUnion> | undefined, // supporting old javascript based code
  editMode?: boolean
): MapForm<any> {
  if (!ruleWithThreshold) {
    return createThresholdRuleForm();
  }

  return createThresholdRuleForm(ruleWithThreshold, editMode);
}

function createStaticThresholdForm(threshold?: StaticThresholdRule, editMode: boolean = false): MapForm<any> {
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
        value: threshold?.value ?? null
      }).setTouched(editMode ? !isEmpty(threshold?.value) : false)
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      }).setTouched((threshold as any)?.isCheckboxSelected)
    );
}

function createThresholdMapForm(threshold?: SmartAlertThresholdRule, editMode?: boolean): MapForm<any> {
  if (!threshold || isStaticThresholdRule(threshold)) {
    return createStaticThresholdForm(threshold, editMode);
  }
  throw new Error(`Unknown threshold type ${threshold?.type}.`);
}

export function createThresholdRuleForm(
  ruleWithThreshold?: RuleWithThreshold<InfraAlertRuleUnion>,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL;

  return createMapForm({
    //@ts-expect-error
    validator: validateForm,
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? '>='
      }),
      warningThreshold: createThresholdMapForm(warningThreshold, editMode),
      criticalThreshold: createThresholdMapForm(criticalThreshold, editMode)
    }
  });
}

function validateForm({
  operator,
  warningThreshold,
  criticalThreshold
}: {
  operator: Field<string>;
  warningThreshold: MapForm<any>;
  criticalThreshold: MapForm<any>;
}) {
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
        message: t('in-alerting:smartAlerts.infrastructure.form.selectAtLeastOneThreshold')
      }
    ];
  }

  return null;
}
