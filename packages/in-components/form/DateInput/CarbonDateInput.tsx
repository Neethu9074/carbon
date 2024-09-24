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
  const { onChange, value, disabled, id, hasError, placeholder } = props;

  const convertDateObj = (date: DateInputValue) => {
    return date ? formatDate(new Date(date)) : date;
  };

  const cprops: CarbonDateInputProps = {
    id,
    value: value === null ? undefined : value,
    placeholder,
    disabled,
    hasError,
    onChange: date => {
      if (onChange && typeof date === 'string') {
        onChange(convertDateObj(date));
      }
    },
    dateFormat,
    locale: activeLanguage?.split('-')[0],
    pattern
  };
  return <CarbonDateInput {...cprops} />;
}
