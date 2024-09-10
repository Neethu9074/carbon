/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { default as CarbonDateInput } from './CarbonDateInput';

export default {
  component: CarbonDateInput
};

export const CarbonDateInputDefault = () => {
  const [value, setValue] = useState(null);
  return (
    <div style={{ margin: '1rem', width: '25rem' }}>
      Date Input
      <div style={{ margin: '1rem' }}>Date input Carbon</div>
      <CarbonDateInput
        value={value}
        onChange={(t: any) => {
          setValue(t);
        }}
      />
      <div>{`Date picked: ${value}`}</div>
    </div>
  );
};
