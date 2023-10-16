/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import IconButton from 'in-components/IconButton/IconButton';

export default {
  component: IconButton,
  argTypes: {
    iconSize: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'regular', 'l', 'xl', 'xxl', 'xxxl']
    },
    kind: {
      control: 'select',
      options: ['primary', 'primaryv2', 'secondary', 'action', 'create', 'danger', 'warning', 'info']
    },
    alignment: {
      control: 'select',
      options: ['left', 'right']
    },
    size: {
      control: 'select',
      options: ['normal', 'compact']
    },
    onClick: { action: 'onClick' }
  },
  args: {
    iconSpinning: false,
    disabled: false,
    type: 'lib_release_rocket'
  }
};

export const Default = { args: {} };

export function AllKinds(args) {
  return (
    <>
      {['primary', 'primaryv2', 'action', 'create', 'danger', 'warning', 'info'].map(kind => (
        <IconButton key={kind} {...args} kind={kind} />
      ))}
    </>
  );
}

export function Disabled(args) {
  return (
    <>
      {['primary', 'primaryv2', 'action', 'create', 'danger', 'warning', 'info'].map(kind => (
        <IconButton kind={kind} key={kind} {...args} />
      ))}
    </>
  );
}
Disabled.args = {
  iconSize: 'l',
  disabled: true
};
