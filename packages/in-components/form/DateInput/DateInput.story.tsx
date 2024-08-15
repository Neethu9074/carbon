/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import DateInput from './DateInput';

export default {
  component: DateInput
};

export const DateInputExample = () => {
  const [value, setValue] = useState(null);
  return (
    <div style={{ margin: '1rem', width: '25rem' }}>
      Date Input
      <div style={{ margin: '1rem' }}>Legacy with Carbon Input</div>
      <DateInput
        value={value}
        onChange={(t: any) => {
          setValue(t);
        }}
      />
    </div>
  );
};
