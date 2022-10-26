/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isNumber, isUndefined } from 'lodash';
import React from 'react';

import Input, { InputProps } from 'in-components/form/Input/Input';

interface NumericInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: number;
  allowFloat?: boolean;
  onChange?: (value?: number, originalEvent?: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NumericInput({
  value,
  allowFloat,
  onChange: originalOnChange,
  ...restProps
}: NumericInputProps) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    if (!originalOnChange) return;

    const { value } = e.target;
    const parseFunc = allowFloat ? Number.parseFloat : Number.parseInt;
    const parsedValue = parseFunc(value);
    const isValid = isNumber(parsedValue) && !isNaN(parsedValue);
    originalOnChange(isValid ? parsedValue : undefined, e);
  };

  return (
    <Input
      type="number"
      inputMode="numeric"
      {...restProps}
      onChange={onChange}
      value={isUndefined(value) ? '' : value}
    />
  );
}
