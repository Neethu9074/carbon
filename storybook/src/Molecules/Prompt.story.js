/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import Prompt from 'in-components/Dialog/Prompt';

export default {
  title: 'Molecules|Dialogs/Prompt',
  component: Prompt,
  decorator: { text, action }
};

export const Default = () => (
  <div>
    <Prompt
      header="My Prompt Title"
      headerIcon="lib_views_grid"
      description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      inputLabel="A value"
      initialValue="Some initial value"
      onSubmit={action('onSubmit')}
    />
  </div>
);
