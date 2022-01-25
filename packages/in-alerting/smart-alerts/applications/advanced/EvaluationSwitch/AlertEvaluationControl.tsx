/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

// @ts-expect-error source needs to be converted to TS
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { AlertEvaluationControlPresenter } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControlPresenter';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { AlertEvaluationType, ThresholdType } from 'in-types';

interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  isGlobalSmartAlert?: boolean;
}

export default function AlertEvaluationControl({ form, updateForm, isGlobalSmartAlert }: Props) {
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  const alertType = ((form.get('rule') as MapForm)!.get('alertType') as Field<string>)!.value;
  const isBuiltIn = (form.get('builtIn') as Field<boolean>).value;
  const thresholdType = ((form.get('threshold') as MapForm).get('type') as Field<ThresholdType>)?.value;
  const isAdaptiveThreshold = thresholdType === ADAPTIVE_BASELINE;

  const setEvaluationType = (type: AlertEvaluationType) =>
    updateForm(
      form
        .updateIn(['evaluationType'], f => (f as Field<AlertEvaluationType>).setValue(type).setTouched(true))
        .put(
          'threshold',
          createThresholdForm({ ...(form.get('threshold') as Field<object>).toJS(), type: STATIC_THRESHOLD }, alertType)
        )
    );

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
