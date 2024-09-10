/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// Carbon version of DateInput
import { DateInput as CarbonDateInput, DateInputProps as CarbonDateInputProps } from '@instana/components';

import { formatDate } from 'in-services/formatters/date';
import { activeLanguage } from 'in-i18n';

const dateFormat = 'Y-m-d';

type DateInputValue = string | null | undefined;
type DateInputOnChange = (s: DateInputValue) => void;

export default function DateInput({
  ...props
}: Omit<CarbonDateInputProps, 'value' | 'onChange'> & {
  value: DateInputValue;
  onChange: DateInputOnChange;
}): JSX.Element {
  const { onChange, value, disabled, id, hasError, placeholder } = props;

  const convertDateObj = (date: any) => {
    return date ? formatDate(new Date(date)) : date;
  };

  const cprops: CarbonDateInputProps = {
    id: id,
    value: value === null ? undefined : value,
    placeholder: placeholder,
    disabled: disabled,
    hasError: hasError,
    onChange: date => {
      if (onChange) {
        onChange(convertDateObj(date));
      }
    },
    dateFormat: dateFormat,
    locale: activeLanguage ? activeLanguage.split('-')[0] : undefined
  };
  return <CarbonDateInput {...cprops} />;
}
