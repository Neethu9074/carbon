/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Input from 'in-components/form/Input/Input';

interface ThresholdInputProps {
  disabled?: boolean;
  hasError?: boolean;
  handleChange: (val: number | undefined) => void;
  value: number | undefined;
  className?: string;
}

export default function ThresholdInput({
  disabled = false,
  handleChange,
  hasError = false,
  value,
  className
}: ThresholdInputProps) {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    handleChange(newValue);
  };

  return (
    <Input
      className={className}
      disabled={disabled}
      hasError={hasError}
      id="threshold-input"
      min="0"
      onChange={onInputChange}
      type="number"
      value={value ?? ''}
    />
  );
}
