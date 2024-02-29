/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';

export default {
  component: ConfirmationDialog
};

export const Default = {
  args: {
    header: 'My Prompt Title',
    headerIcon: 'lib_views_grid',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    onSubmit: action('onSubmit')
  }
};

export const KindPrimary = () => (
  <ConfirmationDialog
    header="My Prompt Title"
    headerIcon="lib_views_grid"
    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    onSubmit={action('onSubmit')}
    confirmButtonLabel="Continue"
    confirmButtonKind="primary"
  />
);

export const AutoFocusConfirmButton = () => (
  <ConfirmationDialog
    header="My Prompt Title"
    headerIcon="lib_views_grid"
    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    onSubmit={action('onSubmit')}
    confirmButtonAutoFocus
  />
);
