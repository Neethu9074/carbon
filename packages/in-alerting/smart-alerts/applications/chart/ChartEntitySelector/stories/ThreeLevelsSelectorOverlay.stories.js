/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import {
  options,
  firstLevelChildren
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/stories/treeSelectionData';
import ThreeLevelsSelectorOverlay from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ThreeLevelsSelectorOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';

export default {
  component: ThreeLevelsSelectorOverlay
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ThreeLevelsSelectorOverlay onChange={storybookAction('onChange')} options={options} />
    </PermanentlyVisibleOverlay>
  )
};

export const OnlyTwoLevels = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ThreeLevelsSelectorOverlay onChange={storybookAction('onChange')} options={firstLevelChildren} />
    </PermanentlyVisibleOverlay>
  )
};

export const WithSearch = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ThreeLevelsSelectorOverlay onChange={storybookAction('onChange')} options={options} query={'with Search'} />
    </PermanentlyVisibleOverlay>
  )
};
