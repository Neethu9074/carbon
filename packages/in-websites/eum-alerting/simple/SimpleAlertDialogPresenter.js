import React, { useState } from 'react';
import PropTypes from 'prop-types';

import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import SimpleAlertDialogStep1 from './SimpleAlertDialogStep1';
import SimpleAlertDialogStep2 from './SimpleAlertDialogStep2';
import SimpleAlertDialogStep3 from './SimpleAlertDialogStep3';
import Dialog2 from 'in-new-components/Dialog2/Dialog2';
import Button from 'in-new-components/Button/Button';

import locals from './SimpleAlertDialogPresenter.mless';

const stepTitles = ['Step 1: Select Alert', 'Step 2: Confirm Domain', 'Step 3: Select Alerting Channels'];
const steps = {
  selectAlert: 0,
  confirmDomain: 1,
  selectAlertingChannel: 2
};

export default function SimpleAlertDialogPresenter({
  form,
  timeConfig,
  onChange,
  onClose,
  onCreate,
  websiteLabel,
  editMode
}) {
  const [step, setStep] = useState(steps.selectAlert);

  return (
    <Dialog2
      title={`${editMode ? 'Edit' : 'Create New'} Alert`}
      titleIconType="lib_alerts_create"
      className={locals.dialog}
      onClose={onClose}
      doNotCloseOnOutsideClick
    >
      <StepProgressBar stepTitles={stepTitles} step={step} />

      <form className={locals.form}>
        {step === steps.selectAlert && (
          <SimpleAlertDialogStep1 form={form} onChange={onChange} timeConfig={timeConfig} />
        )}
        {step === steps.confirmDomain && (
          <SimpleAlertDialogStep2 form={form} timeConfig={timeConfig} websiteLabel={websiteLabel} />
        )}
        {step === steps.selectAlertingChannel && <SimpleAlertDialogStep3 form={form} onChange={onChange} />}
      </form>

      <nav className={locals.controls}>
        <Button
          className={locals.button}
          kind="secondary"
          onClick={() => (step === steps.selectAlert ? onClose() : handleBackClick(setStep, step))}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          className={locals.button}
          onClick={() => (isLastStep(step, steps) ? onCreate() : handleNextClick(setStep, step))}
          disabled={isLastStep(step, steps) && form.touched && !form.hierarchyValid}
        >
          {isLastStep(step, steps) ? (editMode ? 'Save' : 'Create') : 'Next'}
        </Button>
      </nav>
    </Dialog2>
  );
}

SimpleAlertDialogPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool
};

function isLastStep(step, steps) {
  return step === Object.entries(steps).length - 1;
}

function handleNextClick(setStep, step) {
  setStep(step + 1);
}

function handleBackClick(setStep, step) {
  setStep(step - 1);
}
