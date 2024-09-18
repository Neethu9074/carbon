/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { default as LegacyDateInput } from './LegacyDateInput';

export default {
  component: LegacyDateInput
};

export const LegacyDateInputExample = () => {
  const [value, setValue] = useState(null);
  return (
    <div style={{ margin: '1rem', width: '25rem' }}>
      Date Input
      <div style={{ margin: '1rem' }}>Date input Legacy</div>
      <LegacyDateInput
        value={value}
        placeholder="YYYY-MM-DD"
        onChange={(t: any) => {
          setValue(t);
        }}
      />
      <div>{`Date picked: ${value}`}</div>
    </div>
  );
};
