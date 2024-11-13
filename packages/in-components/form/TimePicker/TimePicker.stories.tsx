/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// third party package is not exporting types
// @ts-expect-error
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TimePickerWithTypedProps as TimePicker } from './TimePickerWithTypedProps';

const sizes = {
  large: 'lg',
  medium: 'md',
  small: 'sm'
};

const meta: Meta<typeof TimePicker> = {
  title: 'in-components/Form/TimePicker',
  component: TimePicker,
  args: {
    disabled: false,
    readOnly: false,
    warningText: null,
    warning: false,
    invalid: false,
    invalidText: null,
    placeholder: '00:00',
    onChange: () => {},
    value: '01:00',
    labelText: 'Input time',
    hideLabel: false
  },
  argTypes: {
    size: { type: 'select', options: Object.keys(sizes), mapping: sizes }
  }
};

export default meta;

type Story = StoryObj<typeof TimePicker>;
export const Default: Story = {};

export const CustomError = () => {
  return <TimePicker onChange={() => {}} value="13:00" invalid invalidText="Only morning hours are supported" />;
};

export const WithSeconds = () => {
  return <TimePicker onChange={() => {}} value="13:00:00" seconds labelText="Enter time with seconds" />;
};

export const SizeSmall = () => {
  return <TimePicker onChange={() => {}} value="13:00:00" seconds size="sm" labelText="Enter time with seconds" />;
};
