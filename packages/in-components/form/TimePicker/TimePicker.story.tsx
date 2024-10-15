/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import type { TimePickerProps } from 'in-components/form/TimePicker/types';
import TimePicker from 'in-components/form/TimePicker/TimePicker';

const sizes = {
  large: 'lg',
  medium: 'md',
  small: 'sm'
};

export const doc = () => {
  return (
    <div style={{ width: '50%' }}>
      <h2 className="--cds-">TimePicker</h2>
      <div>
        A component that provides an Instana wrapper around the Carbon components for picking time. Using this version
        rather than the Carbon native components directly allows for a consistent usage of time picking across Instana.
        TimeFormat is automatically checked to match the pattern <code>/^([01]\d|2[0-3]):?([0-5]\d)$/</code>
      </div>
    </div>
  );
};

export default {
  component: TimePicker
};

export const Default = (props: TimePickerProps) => <TimePicker {...props} />;
Default.args = {
  value: '1:00',
  labelText: 'Input time',
  size: 'md',
  disabled: false,
  readOnly: false,
  warningText: 'This is a warning somethings not great',
  warning: false,
  invalid: false,
  invalidText: 'This field is in error',
  placeholder: '00:00'
};
Default.argTypes = {
  size: { type: 'select', options: Object.keys(sizes), mapping: sizes }
};
