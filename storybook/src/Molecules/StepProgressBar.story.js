import React, { useState } from 'react';

import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import Button from 'in-new-components/Button';

export default {
  title: 'Molecules/StepProgressBar',
  component: StepProgressBar
};

const stepTitles = ['Step1: Lorem', 'Step2: Ipsum', 'Step3: dolor', 'Step4: sit', 'Step5: amet'];

const divider = {
  marginTop: '2rem'
};

export const stepProgressBar = () => {
  const [step, setStep] = useState(0);

  return (
    <>
      <div>
        <StepProgressBar stepTitles={stepTitles} step={step} />
      </div>
      <div style={divider}>
        <Button kind="secondary" onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </div>
    </>
  );
};
