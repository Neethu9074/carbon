/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';

export default {
  component: FloatingActionButton
};

export const Standard = {
  render: () => (
    <FloatingActionButton onClick={storybookAction('clicked')}> Example Floating Button </FloatingActionButton>
  )
};

export const WithIconAndText = {
  render: () => (
    <FloatingActionButton icon="lib_alerts_create" onClick={storybookAction('clicked')}>
      With icon and text
    </FloatingActionButton>
  )
};

export const WithIcon = {
  render: () => <FloatingActionButton icon="lib_alerts_create" onClick={storybookAction('clicked')} />
};
