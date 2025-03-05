/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import SourceDestinationSelectorOverlay from 'in-components/QueryBuilder/SourceDestinationSelectorOverlay/SourceDestinationSelectorOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import { destination } from 'in-components/QueryBuilder/SourceDestinationSelectorOverlay/supportedSelections';

export default {
  component: SourceDestinationSelectorOverlay
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SourceDestinationSelectorOverlay
        value={destination}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'default'
};

export const SourceEnabledTrue = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SourceDestinationSelectorOverlay
        sourceEnabled
        value={destination}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'sourceEnabled={true}'
};

export const DestinationEnabledTrue = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SourceDestinationSelectorOverlay
        destinationEnabled
        value={destination}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'destinationEnabled={true}'
};

export const SourceEnabledTrueDestinationEnabledTrue = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SourceDestinationSelectorOverlay
        sourceEnabled
        destinationEnabled
        value={destination}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'sourceEnabled={true} destinationEnabled={true}'
};
