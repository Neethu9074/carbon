import React, { useState } from 'react';
import PropTypes from 'prop-types';

import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Button from 'in-new-components/Button/Button';

import locals from './SimpleModePageNavigation.mless';

export default function SimpleModePageNavigation({
  editMode,
  form,
  onClose,
  onCreate,
  setSimpleModeStep,
  updateForm,
  renderStep,
  stepConfigs,
  onStepChanged
}) {
  const [step, setStep] = useState(0);

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

      <form onSubmit={e => handleSubmit(e, step)}>
        {renderStep(step)}

        <div className={locals.controls}>
          <Button className={locals.button} kind="secondary" onClick={() => backOrCancel(step)}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button type="submit" className={locals.button} disabled={form.touched && !form.hierarchyValid}>
            {step === stepConfigs.length - 1 ? (editMode ? 'Save' : 'Create') : 'Next'}
          </Button>
        </div>
      </form>
    </>
  );
}

SimpleModePageNavigation.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
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
  onStepChanged: PropTypes.func
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
    const field = form.getIn(fieldPath);
    if (field && !field.valid) {
      updateForm(form.updateIn(fieldPath, f => f.setTouched(true)));
      valid = false;
    }
  });
  return valid;
}
