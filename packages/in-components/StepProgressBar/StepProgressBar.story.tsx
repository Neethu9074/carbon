/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { StepProgressBar } from '@instana/components';
import { Button } from '@instana/legacy';

export default {
  component: StepProgressBar
};

const stepTitles = [
  'Step1: Lorem - with a very long',
  'Step2: Ipsum - with another long title',
  'Step3: dolor',
  'Step4: sit',
  'Step5: amet'
];

const divider = {
  marginTop: '2rem'
};

export const StepProgressBarDemo = () => {
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
