import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import TimePresenter from 'in-new-components/time/TimePresenter';

export default {
  title: 'Organisms|time/TimePresenter',
  component: TimePresenter,
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  decorators: [withKnobs]
};

export function Fixed() {
  return (
    <TimePresenter
      expanded={boolean('Expanded', false)}
      timeConfig={{ windowSize, to: Date.now() }}
      historicData={boolean('Historic Data', false)}
      retention={retention}
      largeData={boolean('Large Data', false)}
      onClick={action('click')}
    />
  );
}

export function Live() {
  return (
    <TimePresenter
      expanded={boolean('Expanded', false)}
      timeConfig={{ windowSize, to: null }}
      historicData={boolean('Historic Data', false)}
      retention={retention}
      largeData={boolean('Large Data', false)}
      onClick={action('click')}
    />
  );
}

const windowSize = number('Window Size', 3600000, {
  range: true,
  min: 60000,
  max: 2592000000,
  step: 60000
});

const retention = number('Retention', 7, {
  range: true,
  min: 1,
  max: 365,
  step: 1
});
