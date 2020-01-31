import { action } from '@storybook/addon-actions';
import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';

export default {
  title: 'Organisms|TimeSelectionDialog',
  component: TimeSelectionDialogPresenter
};

export const Default = () => (
  <TimeSelectionDialogPresenter
    timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
    onChange={action('onChange')}
  />
);

export const PastLive = () => (
  <TimeSelectionDialogPresenter
    timeConfig={{ windowSize: 1000 * 60 * 5, to: null, focusedMoment: null }}
    onChange={action('onChange')}
    containsPastLiveData
  />
);
