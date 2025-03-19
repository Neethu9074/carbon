/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import CarbonDateInput, { DateInputValue, DateInputProps } from 'in-components/form/DateInput/DateInput';

export default {
  component: CarbonDateInput
};

export const CarbonDateInputDefault = (args: DateInputProps) => {
  const [value, setValue] = useState<DateInputValue>(null);
  return (
    <div style={{ margin: '1rem', width: '25rem' }}>
      Date Input
      <div style={{ margin: '1rem' }}>Date input Carbon</div>
      <CarbonDateInput
        {...args}
        placeholder="YYYY-MM-DD"
        value={value}
        onChange={t => {
          setValue(t);
        }}
      />
      <div>{`Date picked: ${value}`}</div>
    </div>
  );
};

export const CarbonDateInputLabelMedium = (args: DateInputProps) => {
  const [value, setValue] = useState<DateInputValue>(null);
  return (
    <div style={{ margin: '1rem', width: '25rem' }}>
      Date Input
      <div style={{ margin: '1rem' }}>Date input Carbon</div>
      <CarbonDateInput
        {...args}
        placeholder="YYYY-MM-DD"
        value={value}
        onChange={t => {
          setValue(t);
        }}
        labelText="Enter or pick date"
        size="md"
      />
      <div>{`Date picked: ${value}`}</div>
    </div>
  );
};
