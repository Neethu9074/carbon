import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import Button from 'in-new-components/Button';
import Root from '../_helpers/Root';

storiesOf('Components/StepProgressBarStory', module).add('Steps', () => <Step1 />);

const stepTitles = ['Step1: Lorem', 'Step2: Ipsum', 'Step3: dolor', 'Step4: dolor'];

const divider = {
  marginTop: '2rem'
};

function Step1() {
  const [step, setStep] = useState(0);

  return (
    <Root>
      <div>
        <StepProgressBar stepTitles={stepTitles} step={step} />
      </div>
      <div style={divider}>
        <Button kind="secondary" onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </div>
    </Root>
  );
}
