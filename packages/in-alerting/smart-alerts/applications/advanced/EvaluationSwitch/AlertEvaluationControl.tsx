/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { AlertEvaluationControlPresenter } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControlPresenter';
// @ts-expect-error source needs to be converted to TS
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ApplicationAlertType, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { AlertEvaluationType, ThresholdType } from 'in-types';

interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  isGlobalSmartAlert?: boolean;
}

export default function AlertEvaluationControl({ form, updateForm, isGlobalSmartAlert }: Props) {
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  const alertType = ((form.get('rule') as MapForm)!.get('alertType') as Field<ApplicationAlertType>)!.value;
  const isBuiltIn = (form.get('builtIn') as Field<boolean>).value;
  const thresholdType = ((form.get('threshold') as MapForm).get('type') as Field<ThresholdType>)?.value;
  const isAdaptiveThreshold = thresholdType === ADAPTIVE_BASELINE;

  const setEvaluationType = (type: AlertEvaluationType) => {
    // only update, when value changed
    if (type !== evaluationType) {
      // we need to reset the type, if only Static Threshold is
      const blueprintConfig = getBlueprintConfig(alertType);
      const threshold = (form.get('threshold') as Field<object>).toJS();
      const isPerAp = type === PER_AP;

      // reset to static threshold in case historic baseline is not supported
      const needsStaticThresholdType =
        !blueprintConfig?.baselineEnabled || ((!isPerAp || isGlobalSmartAlert) && !isAdaptiveThreshold);

      const newThreshold = {
        ...threshold,
        type: needsStaticThresholdType ? STATIC_THRESHOLD : thresholdType
      };

      updateForm(
        form
          .updateIn(['evaluationType'], f => (f as Field<AlertEvaluationType>).setValue(type).setTouched(true))
          .put('threshold', createThresholdForm(newThreshold, alertType))
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
    />
  );
}
