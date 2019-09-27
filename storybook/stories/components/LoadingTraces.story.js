import { number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';

const prepProgress = {
  loading: true
};

const runningProgress = {
  loading: true,
  percentage: number('Percentage', 0.5, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01
  })
};

const errors = [
  {
    Message: 'Deadline exceeded'
  }
];

const failedProgress = {
  loading: false,
  percentage: null
};

storiesOf('Components/Loading/Analyze Loading States', module)
  .addParameters({ component: LoadingStates })
  .add('Default', () => <LoadingStates progress={prepProgress} />)
  .add('Query Running', () => <LoadingStates progress={runningProgress} />)
  .add('Query Failed', () => <LoadingStates progress={failedProgress} errors={errors} />);
