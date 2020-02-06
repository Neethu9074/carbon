import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import TimePresenter from 'in-new-components/time/TimePresenter';

export default {
  title: 'Organisms|TimePresenter',
  component: TimePresenter,
  decorators: [withKnobs]
};

export const Example = () => {
  const to = Date.now();

  const windowSize = number('Window Size', 3600000, {
    range: true,
    min: 60000,
    max: 2592000000,
    step: 60000
  });

  return (
    <TimePresenter
      expanded={boolean('Expanded', false)}
      timeConfig={{ windowSize, to }}
      historicData={boolean('Historic Data', false)}
      largeData={boolean('Large Data', false)}
      onClick={action('click')}
    />
  );
};
