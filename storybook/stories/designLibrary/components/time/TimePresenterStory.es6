import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import TimePresenter from 'in-new-components/time/TimePresenter';
import Root from '../../../_helpers/Root';

storiesOf('designLibrary/Components/Time/TimePresenter', module)
  .addDecorator(withKnobs)
  .add('Fixed', () => <Example to={1519297047052} />)
  .add('Live', () => <Example to={null} />);

function Example({ to }) {
  const windowSize = number('Window Size', 3600000, {
    range: true,
    min: 60000,
    max: 2592000000,
    step: 60000
  });
  return (
    <Root style={{ background: '#0C2227', padding: '1rem' }}>
      <TimePresenter expanded={boolean('Expanded', false)} timeframe={{ windowSize, to }} onClick={action('click')} />
    </Root>
  );
}
