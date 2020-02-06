import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SimpleAlertConfigDialogStep1 from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep3 from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogStep3';
import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import Button from 'in-new-components/Button/Button';

import locals from './SimpleModeContainer.mless';

const steps = {
  selectAlert: 0,
  selectScope: 1,
  selectAlertingChannel: 2
};

const stepTitles = ['Step 1: Select Alert', 'Step 2: Select Scope', 'Step 3: Select Alerting Channels'];

export default function SimpleModeContainer({
  editMode,
  form,
  granularity,
  onChange,
  onClose,
  setSliderState,
  timeConfig,
  websiteLabel,
  onCreate,
  setSimpleModeStep
}) {
  const [step, setStep] = useState(0);
  return (
    <>
      <StepProgressBar stepTitles={stepTitles} step={step} />
      <form className={locals.form}>
        {step === steps.selectAlert && (
          <SimpleAlertConfigDialogStep1
            form={form}
            onChange={onChange}
            timeConfig={timeConfig}
            setJsErrorsListVisible={setSliderState}
            granularity={granularity}
          />
        )}
        {step === steps.selectScope && (
          <SimpleAlertConfigDialogStep2
            form={form}
            timeConfig={timeConfig}
            websiteLabel={websiteLabel}
            onChange={onChange}
            granularity={granularity}
          />
        )}
        {step === steps.selectAlertingChannel && (
          <SimpleAlertConfigDialogStep3 form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
        )}
      </form>

      <nav className={locals.controls}>
        <Button
          className={locals.button}
          kind="secondary"
          onClick={() => (step === steps.selectAlert ? onClose() : handleBackClick(setStep, step, setSimpleModeStep))}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          className={locals.button}
          onClick={() => (isLastStep(step, steps) ? onCreate() : handleNextClick(setStep, step, setSimpleModeStep))}
          disabled={isLastStep(step, steps) && form.touched && !form.hierarchyValid}
        >
          {isLastStep(step, steps) ? (editMode ? 'Save' : 'Create') : 'Next'}
        </Button>
      </nav>
    </>
  );
}

SimpleModeContainer.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  timeConfig: PropTypes.any,
  websiteLabel: PropTypes.any
};

function isLastStep(step, steps) {
  return step === Object.entries(steps).length - 1;
}

function handleNextClick(setStep, step, setSimpleModeStep) {
  setStep(step + 1);
  setSimpleModeStep(step + 1);
}

function handleBackClick(setStep, step, setSimpleModeStep) {
  setStep(step - 1);
  setSimpleModeStep(step - 1);
}
