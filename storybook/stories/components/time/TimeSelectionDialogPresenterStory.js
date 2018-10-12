import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';

import Root from '../../_helpers/Root';

storiesOf('Components/Time/Time-Selection Dialog', module)
  .add('default', () => <Default />)
  .add('Past Live', () => <PastLive />);

function Default() {
  return (
    <Root>
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
        onChange={action('onChange')}
      />
      <OverlayPresenter />
    </Root>
  );
}

function PastLive() {
  return (
    <Root>
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
        onChange={action('onChange')}
        containsPastLiveData
      />
      <OverlayPresenter />
    </Root>
  );
}
