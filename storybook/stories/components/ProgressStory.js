import { withKnobs, boolean, text, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import Progress from 'in-components/Progress';
import Root from '../_helpers/Root';

const inProgress = {
  loading: true
};

const done = {
  loading: false
};

storiesOf('components/Progress', module)
  .addDecorator(withKnobs)
  .add('States', () => <States />)
  .add('Delayed Presentation', () => <DelayedPresentation />)
  .add('Horizontal', () => <HorizontalIndicatorStory />);


function States() {
  const isLoading = boolean('Loading?', true);
  const note = text('Note', '');
  const percentage = number('Percentage', 0.5, {
     range: true,
     min: 0,
     max: 1,
     step: 0.01
  });

  return (
    <Root>
      <h2>Indeterminate</h2>
      <Progress progress={{
        loading: isLoading,
        note
      }} />

      <h2>Percentage</h2>
      <Progress progress={{
        loading: isLoading,
        percentage,
        note
      }} />
    </Root>
  );
}


function DelayedPresentation() {
  const isLoading = boolean('Loading?', false);

  return (
    <Root>
      <p>
        Use the knobs to control the loading state. Note the delay between the switch to a loading
        state and the delay in loading presentation. This is deliberate to improve
        the <a href="https://twitter.com/acdlite/status/954799535078834176">perceived performance</a>.
      </p>

      <Progress progress={isLoading ? inProgress : done} />

      {!isLoading && <p style={{color: 'darkred'}}>
        Done Loading! Use the knobs to control the loading state!
      </p>}
    </Root>
  );
}


function HorizontalIndicatorStory() {
  return (
    <Root>
      <h2>Indeterminate</h2>
      <HorizontalIndicator progress={{
        loading: true
      }} />

      <h2>Determinate</h2>
      <HorizontalIndicator progress={{
        loading: true,
        percentage: number('Percentage', 0.5, {
           range: true,
           min: 0,
           max: 1,
           step: 0.01
        })
      }} />
    </Root>
  );
}
