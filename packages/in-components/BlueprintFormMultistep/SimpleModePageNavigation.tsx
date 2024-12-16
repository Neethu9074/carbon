/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm, MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { StepProgressBar } from '@instana/components';

import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './SimpleModePageNavigation.mless';

interface SimpleModePageNavigationProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  formId: string;
  onClose: VoidFunction;
  onCreate?: VoidFunction;
  updateForm: (form: MapForm<FORM_TYPE>) => void;
  setSimpleModeStep: (step: number) => void;
  renderStep: (step: number) => React.ReactNode;
  stepConfigs: StepConfigs;
  onStepChanged: (oldStep: number, nextStep: number) => void;
  isSaving?: boolean;
  simpleModeStep?: number;
  additionalStepCheck?: (step: number) => boolean;
  noStepCheckOnFirstStep?: boolean;
  customSaveButtonText?: string;
  renderCustomSaveAction?: () => React.ReactElement;
}

export default function SimpleModePageNavigation<FORM_TYPE extends MapFormItems>({
  form,
  formId,
  onClose,
  onCreate,
  setSimpleModeStep,
  simpleModeStep,
  updateForm,
  renderStep,
  stepConfigs,
  onStepChanged,
  isSaving,
  additionalStepCheck = () => true,
  noStepCheckOnFirstStep = false,
  customSaveButtonText,
  renderCustomSaveAction
}: SimpleModePageNavigationProps<FORM_TYPE>) {
  const [step, setStep] = useState(0);

  if (simpleModeStep && simpleModeStep > step) {
    setStep(simpleModeStep);
  }

  const handleUpdateState = (oldStep: number, nextStep: number) => {
    setStep(nextStep);
    setSimpleModeStep(nextStep);
    onStepChanged(oldStep, nextStep);
  };

  const nextOrCreate = (oldStep: number) => {
    if (oldStep === stepConfigs.length - 1) {
      if (form.hierarchyValid && onCreate) {
        onCreate();
      }
    } else {
      handleUpdateState(oldStep, oldStep + 1);
    }
  };

  const backOrCancel = (oldStep: number) => {
    if (oldStep === 0) {
      onClose();
    } else {
      handleUpdateState(oldStep, oldStep - 1);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, step: number) => {
    stopPropagationAndPreventDefault(event);
    const stepValid = validateStep(step, stepConfigs, form, updateForm);

    if (stepValid) {
      nextOrCreate(step);
    }
  };

  return (
    <>
      <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />

      <form onSubmit={e => handleSubmit(e, step)} className={locals.form} id={formId}>
        {renderStep(step)}

        <SimpleDialogFooter
          form={form}
          formId={formId}
          additionalStepCheck={additionalStepCheck}
          backOrCancel={backOrCancel}
          isSaving={isSaving}
          step={step}
          stepConfigs={stepConfigs}
          customSaveButtonText={customSaveButtonText}
          noStepCheckOnFirstStep={noStepCheckOnFirstStep}
          renderCustomSaveAction={renderCustomSaveAction}
        />
      </form>
    </>
  );
}

function mapTitles(stepConfigs: StepConfigs) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}

function validateStep<FORM_TYPE extends MapFormItems>(
  step: number,
  stepConfigs: StepConfigs,
  form: MapForm<FORM_TYPE>,
  updateForm: (form: MapForm<FORM_TYPE>) => void
) {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return true;
  }

  let valid = true;
  fieldsToValidate.forEach(fieldPath => {
    try {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      const field = form.getIn(fieldPath);
      if (field && !field.valid) {
        // @ts-expect-error
        updateForm(form.updateIn(fieldPath, f => f.setTouched(true)));
        valid = false;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });
  return valid;
}
