import { action } from '@storybook/addon-actions';
import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';

export default {
  title: 'Organisms|time/TimeSelectionDialog',
  component: TimeSelectionDialogPresenter
};

export function Default() {
  return (
    <>
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
        onChange={action('onChange')}
      />
      <OverlayPresenter />
    </>
  );
}

export function PastLive() {
  return (
    <>
      <TimeSelectionDialogPresenter
        timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
        onChange={action('onChange')}
        containsHistoricData
      />
      <OverlayPresenter />
    </>
  );
}
