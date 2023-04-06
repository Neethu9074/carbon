/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import { Item } from 'formalistic';
import { useState } from 'react';

type FieldPath = string[];

export interface StepConfig {
  title: string;
  validateIntermediately?: FieldPath[];
}

export interface SetupProps {
  stepConfigs: StepConfig[];
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  onCreate: (simpleMode: boolean) => void;
  onClose: () => void;
  onStepChanged: (oldStep: number, newStep: number) => void;
}

export function useSimpleModePageNavigation({
  stepConfigs,
  form,
  setForm,
  onCreate,
  onClose,
  onStepChanged
}: SetupProps) {
  const [step, setStep] = useState<number>(0);
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const handleUpdateState = (oldStep: number, nextStep: number) => {
    setStep(nextStep);
    setSimpleModeStep(nextStep);
    onStepChanged(oldStep, nextStep);
  };

  const backOrCancel = (oldStep: number) => {
    if (oldStep === 0) {
      onClose();
    } else {
      handleUpdateState(oldStep, oldStep - 1);
    }
  };

  const nextOrCreate = (oldStep: number) => {
    if (oldStep === stepConfigs.length - 1) {
      if (form.hierarchyValid) {
        onCreate(true);
      }
    } else {
      handleUpdateState(oldStep, oldStep + 1);
    }
  };

  const handleSubmit = () => {
    const stepValid = validateStep(step, stepConfigs, form, setForm);
    if (stepValid) {
      nextOrCreate(step);
    }
  };

  return {
    step,
    setStep,
    simpleModeStep,
    backOrCancel,
    handleSubmit
  };
}

function validateStep(
  step: number,
  stepConfigs: StepConfig[],
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
) {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return true;
  }

  let valid = true;
  fieldsToValidate.forEach((fieldPath: FieldPath) => {
    try {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      const field: Item = form.getIn(fieldPath);
      if (field && !field.valid) {
        updateForm(form.updateIn(fieldPath as any, (f: Item) => f.setTouched(true)));
        valid = false;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });
  return valid;
}
