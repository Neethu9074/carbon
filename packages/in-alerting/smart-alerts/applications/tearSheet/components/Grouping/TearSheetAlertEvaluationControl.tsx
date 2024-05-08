/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { TearSheetAlertEvaluationControlPresenter } from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/TearSheetAlertEvaluationControlPresenter';
import {
  ApplicationAlertType,
  BluePrint,
  getBlueprintConfig
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { AlertEvaluationType, ThresholdConfigUnion, ThresholdType } from 'in-types';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isGlobalSmartAlert?: boolean;
}

export default function TearSheetAlertEvaluationControl({ form, updateForm, isGlobalSmartAlert }: Props) {
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  const alertType = ((form.get('rule') as MapForm<any>)!.get('alertType') as Field<ApplicationAlertType>)!.value;
  const isBuiltIn = (form.get('builtIn') as Field<boolean>).value;
  const thresholdType = ((form.get('threshold') as MapForm<any>).get('type') as Field<ThresholdType>)?.value;
  const isAdaptiveThreshold = thresholdType === ADAPTIVE_BASELINE;

  const setEvaluationType = (newEvaluationType: AlertEvaluationType) => {
    // only update, when value changed
    if (newEvaluationType !== evaluationType) {
      // we need to reset the type, if only Static Threshold is
      const blueprintConfig = getBlueprintConfig(alertType);
      const threshold = (form.get('threshold') as Field<object>).toJS();

      // reset to static threshold in case historic baseline is not supported
      const newThresholdType = getThresholdTypeForUpdatedEvaluationType(
        blueprintConfig,
        newEvaluationType,
        isGlobalSmartAlert,
        thresholdType
      );

      const newThreshold = {
        ...threshold,
        type: newThresholdType
      } as ThresholdConfigUnion;

      updateForm(
        form
          .updateIn(['evaluationType'], f =>
            (f as Field<AlertEvaluationType>).setValue(newEvaluationType).setTouched(true)
          )
          .put('threshold', createThresholdForm(newThreshold, alertType))
      );
    }
  };

  return (
    <TearSheetAlertEvaluationControlPresenter
      evaluationType={evaluationType}
      isAdaptiveThreshold={isAdaptiveThreshold}
      isBuiltIn={isBuiltIn}
      isGlobalSmartAlert={isGlobalSmartAlert}
      setEvaluationType={setEvaluationType}
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
