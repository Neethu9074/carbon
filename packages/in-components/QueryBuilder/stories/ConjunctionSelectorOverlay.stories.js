/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import ConjunctionSelectorOverlay from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/ConjunctionSelectorOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';

export default {
  component: ConjunctionSelectorOverlay
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ConjunctionSelectorOverlay value={or} onChange={storybookAction('onChange')} close={storybookAction('close')} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'default'
};
