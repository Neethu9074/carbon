import { storiesOf } from '@storybook/react';
import React from 'react';

import TimeCount from 'in-new-components/time/TimeCount';

import Root from '../../_helpers/Root';

storiesOf('Components/Time/Time-Count', module).add('Count', () => <Example start={Date.now()} />);

function Example({ start }) {
  return (
    <Root style={{ background: '#00B3B3', padding: '1rem' }}>
      <TimeCount start={start} />
    </Root>
  );
}
