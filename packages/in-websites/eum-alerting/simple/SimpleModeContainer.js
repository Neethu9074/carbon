import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/components/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep1 from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogStep2';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import { websitesAlertingStepSwitch } from 'in-websites/eum-alerting/tracker';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
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
  setSimpleModeStep,
  setForm
}) {
  const [step, setStep] = useState(0);

  return (
    <>
      <StepProgressBar stepTitles={stepTitles} step={step} />

      <form onSubmit={e => handleSubmit(e, step, setStep, form, setForm, setSimpleModeStep, onCreate)}>
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

        <div className={locals.controls}>
          {/* TODO: Put Back Button functionality in own button */}
          <Button
            className={locals.button}
            kind="secondary"
            onClick={() => (step === steps.selectAlert ? onClose() : handleBackClick(setStep, step, setSimpleModeStep))}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button type="submit" className={locals.button} disabled={form.touched && !form.hierarchyValid}>
            {isLastStep(step, steps) ? (editMode ? 'Save' : 'Create') : 'Next'}
          </Button>
        </div>
      </form>
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
  websiteLabel: PropTypes.any,
  setForm: PropTypes.func.isRequired
};

function isLastStep(step, steps) {
  return step === Object.entries(steps).length - 1;
}

function handleNextClick(setStep, step, setSimpleModeStep) {
  setStep(step + 1);

  // mixpanel tracking
  setSimpleModeStep(step + 1);
  websitesAlertingStepSwitch({ step, nextStep: step + 1 });
}

function handleBackClick(setStep, step, setSimpleModeStep) {
  setStep(step - 1);

  // mixpanel tracking
  setSimpleModeStep(step - 1);
  websitesAlertingStepSwitch({ step, nextStep: step - 1 });
}

function handleSubmit(e, step, setStep, form, setForm, setSimpleModeStep, onCreate) {
  stopPropagationAndPreventDefault(e);

  let stepValid = true;
  if (step === steps.selectAlert) {
    if (form.containsKey(fieldNames.ruleValue)) {
      stepValid = form.get(fieldNames.ruleValue).valid;
    }
  } else if (step === steps.selectAlertingChannel) {
    stepValid = form.get(fieldNames.alertChannelIds).valid;
  } else {
    stepValid = form.hierarchyValid;
  }

  if (step === steps.selectAlert) {
    if (!stepValid) {
      setForm(form.updateIn([fieldNames.ruleValue], f => f.setTouched(true)));
    } else {
      setForm(form.setTouched(false, { recurse: true }));
      handleNextClick(setStep, step, setSimpleModeStep);
    }
    return;
  }

  if (step === steps.selectAlertingChannel) {
    if (!stepValid) {
      setForm(form.updateIn([fieldNames.alertChannelIds], f => f.setTouched(true)));
    } else {
      setForm(form.setTouched(false, { recurse: true }));
      onCreate();
    }
    return;
  }

  handleNextClick(setStep, step, setSimpleModeStep);
}
