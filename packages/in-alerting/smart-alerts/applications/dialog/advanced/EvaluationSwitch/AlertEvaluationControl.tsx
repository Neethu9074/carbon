/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { AlertEvaluationControlPresenter } from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControlPresenter';
import {
  ApplicationAlertType,
  BluePrint,
  getBlueprintConfig
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
//@ts-expect-error
import { getThresholdData } from 'in-alerting/smart-alerts/applications/dialog/advanced/ThresholdSection';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { AlertEvaluationType, ThresholdType, RuleWithThreshold, ApplicationAlertRuleUnion } from 'in-types';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isGlobalSmartAlert?: boolean;
  tearSheetView?: boolean;
}

export default function AlertEvaluationControl({ form, updateForm, isGlobalSmartAlert, tearSheetView }: Props) {
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  const alertType = ((form.get('rule') as MapForm<any>)!.get('alertType') as Field<ApplicationAlertType>)!.value;
  const isBuiltIn = (form.get('builtIn') as Field<boolean>).value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const isAdaptiveThreshold = thresholdType === ADAPTIVE_BASELINE;
  const evaluationCount = form.get('hiddenFields').get('evaluationGroupByCount').value;

  const setEvaluationType = (newEvaluationType: AlertEvaluationType) => {
    // only update, when value changed
    if (newEvaluationType !== evaluationType) {
      // we need to reset the type, if only Static Threshold is
      const blueprintConfig = getBlueprintConfig(alertType);
      const warningThresholdField = form.get('threshold').get('warningThreshold');
      const criticalThresholdField = form.get('threshold').get('criticalThreshold');
      const warningThreshold = getThresholdData(thresholdType, warningThresholdField, WARNING_SEVERITY);
      const criticalThreshold = getThresholdData(thresholdType, criticalThresholdField, CRITICAL_SEVERITY);

      // reset to static threshold in case historic baseline is not supported
      const newThresholdType = getThresholdTypeForUpdatedEvaluationType(
        blueprintConfig,
        newEvaluationType,
        isGlobalSmartAlert,
        thresholdType
      );

      const newWarningThreshold = {
        WARNING: {
          ...warningThreshold.WARNING,
          type: newThresholdType,
          value: warningThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null,
          isCheckboxSelected: warningThresholdField.get('isCheckboxSelected')?.value
        }
      };

      const newCriticalThreshold = {
        CRITICAL: {
          ...criticalThreshold.CRITICAL,
          type: newThresholdType,
          value: criticalThresholdField.get('isCheckboxSelected')?.value === true ? 0 : null,
          isCheckboxSelected: criticalThresholdField.get('isCheckboxSelected')?.value
        }
      };

      const ruleWithThreshold: RuleWithThreshold<ApplicationAlertRuleUnion> = {
        rule: form.get('rule').toJS(),
        thresholdOperator: form.get('threshold').get('operator').value,
        thresholds: { ...newWarningThreshold, ...newCriticalThreshold }
      };

      updateForm(
        form
          .updateIn(['evaluationType'], f =>
            (f as Field<AlertEvaluationType>).setValue(newEvaluationType).setTouched(true)
          )
          .put('threshold', createThresholdForm(ruleWithThreshold, alertType, true))
      );
    }
  };

  return (
    <AlertEvaluationControlPresenter
      evaluationType={evaluationType}
      isAdaptiveThreshold={isAdaptiveThreshold}
      isBuiltIn={isBuiltIn}
      isGlobalSmartAlert={isGlobalSmartAlert}
      setEvaluationType={setEvaluationType}
      tearSheetView={tearSheetView}
      evaluationCount={evaluationCount}
    />
  );
}

export function getThresholdTypeForUpdatedEvaluationType(
  blueprintConfig: BluePrint | undefined,
  newEvaluationType: AlertEvaluationType,
  isGlobalSmartAlert: boolean | undefined = false,
  thresholdType: ThresholdType | undefined
) {
  const thresholdTypeOptions = blueprintConfig?.getThresholdTypeOptions() ?? [];

  const options = filterThresholdTypeOptionsForEvaluationType(
    thresholdTypeOptions,
    newEvaluationType,
    isGlobalSmartAlert
  );

  if (
    thresholdType &&
    options
      .filter(getOptionsFilterForThresholdTyp(thresholdType))
      .find(option => option.value.startsWith(thresholdType))
  ) {
    return thresholdType;
  }

  // use first entry as fallback
  return options[0]?.value;
}
