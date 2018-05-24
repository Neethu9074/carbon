import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import Root from '../../../_helpers/Root';

storiesOf('designLibrary/Components/Time/TimeSelectionDialog', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <TimeSelectionDialogPresenter timeframe={{ windowSize: 1000 * 60 * 5, to: null }} onChange={action('onChange')} />
      <OverlayPresenter />
    </Root>
  );
}
