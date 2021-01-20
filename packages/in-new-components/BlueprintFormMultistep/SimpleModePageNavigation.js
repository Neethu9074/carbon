/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SaveButton from 'in-components/form/SaveButton';
import Button from 'in-new-components/Button/Button';
import useObservable from 'in-hooks/useObservable';

import locals from './SimpleModePageNavigation.mless';

export default function SimpleModePageNavigation({
  form,
  onClose,
  onCreate,
  setSimpleModeStep,
  simpleModeStep,
  updateForm,
  renderStep,
  stepConfigs,
  onStepChanged,
  isSaving,
  additionalStepCheck = () => true
}) {
  const [step, setStep] = useState(0);
  const isCalculatingThreshold = useObservable(thresholdOrBaselineLoadingSignal$, []);

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

  const isDisabled =
    (step === stepConfigs.length - 1 && !form.hierarchyValid) ||
    isStepValid(step, stepConfigs, form) ||
    !additionalStepCheck(step);

  return (
    <>
      <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />

      <form onSubmit={e => handleSubmit(e, step)}>
        {renderStep(step)}

        <div className={locals.controls}>
          <Button className={locals.button} kind="secondary" onClick={() => backOrCancel(step)}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <SaveButton
            type="submit"
            kind="primary"
            className={locals.button}
            form={form}
            disabled={(isDisabled || isCalculatingThreshold) && step !== 0}
            isSaving={isSaving}
          >
            {step === stepConfigs.length - 1 ? 'Create' : 'Next'}
          </SaveButton>
        </div>
      </form>
    </>
  );
}

SimpleModePageNavigation.propTypes = {
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
  onStepChanged: PropTypes.func,
  isSaving: PropTypes.bool,
  simpleModeStep: PropTypes.number,
  additionalStepCheck: PropTypes.func
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

function isStepValid(step, stepConfigs, form) {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return false;
  }

  let valid = false;
  fieldsToValidate.forEach(fieldPath => {
    try {
      const field = form.getIn(fieldPath);
      if (field && !field.valid) {
        valid = true;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });
  return valid;
}
