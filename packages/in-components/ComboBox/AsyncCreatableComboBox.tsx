/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import AsyncCreatableSelect from 'react-select/async-creatable';
import { FocusEventHandler } from 'react-select';
import React from 'react';

import './ComboBox.less';

export interface Option {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export type Options = ReadonlyArray<Option>;

export interface AsyncCreatableComboBoxProps {
  isClearable?: boolean;
  isLoading?: boolean;
  loadOptions:
    | ((inputValue: string, callback: (options: readonly never[]) => void) => void | Promise<readonly never[]>)
    | undefined;
  defaultOptions?: boolean | readonly never[] | undefined;
  className?: string;
  placeholder?: React.ReactNode;
  onChange?: (option: Option | Options | null) => void;
  isOptionDisabled?: (option: Option) => boolean;
  onBlur?: FocusEventHandler | undefined;
  formatCreateLabel?: (inputValue: string) => React.ReactNode;
}

export default function AsyncCreatableComboBox({
  isClearable = true,
  className,
  ...props
}: AsyncCreatableComboBoxProps): JSX.Element {
  return (
    <AsyncCreatableSelect
      {...props}
      isClearable={isClearable}
      classNamePrefix="Select"
      className={`${className} Select`}
    />
  );
}
