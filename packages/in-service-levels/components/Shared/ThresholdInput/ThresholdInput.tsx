/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Input from 'in-components/form/Input/Input';

interface ThresholdInputProps {
  hasError?: boolean;
  handleChange: (val: number | undefined) => void;
  value: number | undefined;
}

export default function ThresholdInput({ value, handleChange, hasError = false }: ThresholdInputProps) {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    handleChange(newValue);
  };

  return (
    <Input
      id="threshold-input"
      type="number"
      min="0"
      value={value ?? ''}
      onChange={onInputChange}
      hasError={hasError}
    />
  );
}
