/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import StepProgressBar from 'in-components/StepProgressBar/StepProgressBar';

import locals from './SimpleModePageNavigation.mless';

export default function SimpleModePageNavigation({
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
  customSaveButtonText
}) {
  const [step, setStep] = useState(0);

  if (simpleModeStep && simpleModeStep > step) {
    setStep(simpleModeStep);
  }

  const handleUpdateState = (oldStep, nextStep) => {
    setStep(nextStep);
    setSimpleModeStep(nextStep);
    onStepChanged(oldStep, nextStep);
  };

  const nextOrCreate = oldStep => {
    if (oldStep === stepConfigs.length - 1) {
      if (form.hierarchyValid) {
        onCreate();
      }
    } else {
      handleUpdateState(oldStep, oldStep + 1, setStep, setSimpleModeStep, onStepChanged);
    }
  };

  const backOrCancel = oldStep => {
    if (oldStep === 0) {
      onClose();
    } else {
      handleUpdateState(oldStep, oldStep - 1, setStep, setSimpleModeStep, onStepChanged);
    }
  };

  const handleSubmit = (event, step) => {
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
        />
      </form>
    </>
  );
}

SimpleModePageNavigation.propTypes = {
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  setSimpleModeStep: PropTypes.func.isRequired,
  renderStep: PropTypes.func.isRequired,
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ).isRequired,
  onStepChanged: PropTypes.func,
  isSaving: PropTypes.bool,
  simpleModeStep: PropTypes.number,
  additionalStepCheck: PropTypes.func,
  customSaveButtonText: PropTypes.string
};

function mapTitles(stepConfigs) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}

function validateStep(step, stepConfigs, form, updateForm) {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return true;
  }

  let valid = true;
  fieldsToValidate.forEach(fieldPath => {
    try {
      const field = form.getIn(fieldPath);
      if (field && !field.valid) {
        updateForm(form.updateIn(fieldPath, f => f.setTouched(true)));
        valid = false;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });
  return valid;
}
