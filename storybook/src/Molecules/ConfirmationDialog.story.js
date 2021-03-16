/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';

export default {
  title: 'Molecules|Dialogs/ConfirmationDialog',
  component: ConfirmationDialog,
  decorator: { text, action }
};

export const Default = () => (
  <div>
    <ConfirmationDialog
      header="My Prompt Title"
      headerIcon="lib_views_grid"
      description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      onSubmit={action('onSubmit')}
    />
  </div>
);
