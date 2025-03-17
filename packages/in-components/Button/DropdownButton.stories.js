/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import { Stack } from '@instana/components';

import DropdownButton from 'in-components/Button/DropdownButton';

export default {
  component: DropdownButton
};

export const Default = {
  render: () => (
    <Stack>
      <DropdownButton kind="primary" onClick={storybookAction('clicked')}>
        DropdownButton
      </DropdownButton>
      <DropdownButton kind="primary" onClick={storybookAction('clicked')} expanded>
        Expanded DropdownButton
      </DropdownButton>
    </Stack>
  ),

  name: 'default'
};

export const AllKinds = {
  render: () => (
    <Stack>
      <DropdownButton kind="primary">Primary</DropdownButton>
      <DropdownButton kind="primaryv2">PrimaryV2</DropdownButton>
      <DropdownButton kind="secondary">Secondary</DropdownButton>
      <DropdownButton kind="secondaryDarker">Secondary Darker</DropdownButton>
      <DropdownButton kind="action">Action</DropdownButton>
      <DropdownButton kind="subtle">Subtle</DropdownButton>
      <DropdownButton kind="create">create</DropdownButton>
      <DropdownButton kind="danger">Danger</DropdownButton>
      <DropdownButton kind="warning">Warning</DropdownButton>
      <DropdownButton kind="info">Info</DropdownButton>
    </Stack>
  ),

  name: 'All Kinds'
};

export const Disabled = {
  render: () => (
    <DropdownButton kind="primary" disabled>
      Disabled
    </DropdownButton>
  ),
  name: 'Disabled'
};

export const WithIcon = {
  render: () => (
    <DropdownButton kind="primary" icon="lib_help_error_warning">
      With Icon
    </DropdownButton>
  ),
  name: 'With Icon'
};

export const Sizes = {
  render: () => (
    <>
      <DropdownButton icon="lib_help_error_warning" kind="secondary" size="xl">
        Extra Large (xl)
      </DropdownButton>
      <DropdownButton icon="lib_help_error_warning" kind="secondary">
        Default (normal)
      </DropdownButton>
      <DropdownButton icon="lib_help_error_warning" kind="secondary" size="compact">
        Compact (compact)
      </DropdownButton>
    </>
  ),

  name: 'Sizes'
};
