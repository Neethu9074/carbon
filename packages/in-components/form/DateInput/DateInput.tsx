/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// Carbon version of DateInput
import { DateInput as CarbonDateInput, DateInputProps as CarbonDateInputProps } from '@instana/components';

import { formatDate } from 'in-services/formatters/date';
import { activeLanguage } from 'in-i18n';

const dateFormat = 'Y-m-d';
const pattern = '\\d{4}-\\d{1,2}-\\d{1,2}';

export type DateInputValue = string | null | undefined;
export type DateInputOnChange = (s: DateInputValue) => void;
export type DateInputProps = Omit<CarbonDateInputProps, 'value' | 'onChange'> & {
  value: DateInputValue;
  onChange: DateInputOnChange;
};

export default function DateInput({
  ...props
}: Omit<CarbonDateInputProps, 'value' | 'onChange'> & {
  value: DateInputValue;
  onChange: DateInputOnChange;
}): JSX.Element {
  const { onChange, value, disabled, id, hasError, placeholder, labelText, size } = props;

  const convertDateObj = (date: string | Date | number) => {
    return formatDate(new Date(date));
  };

  return (
    <CarbonDateInput
      id={id}
      value={value === null ? undefined : value}
      placeholder={placeholder}
      disabled={disabled}
      hasError={hasError}
      onChange={date => {
        if (date == undefined) return onChange(date);
        onChange(convertDateObj(typeof date === 'object' ? new Date(date.toString()) : date));
      }}
      dateFormat={dateFormat}
      locale={activeLanguage?.split('-')[0]}
      pattern={pattern}
      labelText={labelText}
      size={size}
    />
  );
}
