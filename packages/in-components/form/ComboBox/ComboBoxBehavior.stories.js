/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';

export default {
  component: ComboBoxBehavior
};

export const Default = {
  render: () => (
    <ComboBoxBehavior
      value="b"
      options={[
        {
          label: 'A',
          value: 'a'
        },
        {
          label: 'B',
          value: 'b'
        },
        {
          label: 'C',
          value: 'c'
        }
      ]}
      onChange={storybookAction('onChange')}
    >
      {({ elementProps, options, value, isOpen }) => (
        <DropdownButton kind="secondary" icon="lib_actions_settings" expanded={isOpen} {...elementProps}>
          {value ? options.find(opt => opt.value === value).label : 'Select A Value'}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  )
};
