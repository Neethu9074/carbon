import { action } from '@storybook/addon-actions';
import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import { minutes } from 'in-services/time';

export default {
  title: 'Organisms|time/TimeSelectionDialog',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: TimeSelectionDialogPresenter
};

export function Default() {
  return (
    <div
      style={{
        border: '1px solid #DFE4E8',
        width: 'fit-content'
      }}
    >
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: minutes.toMillis(5), to: null, focusedMoment: null }}
        onChange={action('onChange')}
      />
      <OverlayPresenter />
    </div>
  );
}

export function PastLive() {
  return (
    <div
      style={{
        border: '1px solid #DFE4E8',
        width: 'fit-content'
      }}
    >
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: minutes.toMillis(5), to: null, focusedMoment: null }}
        onChange={action('onChange')}
        containsHistoricData
      />
      <OverlayPresenter />
    </div>
  );
}
