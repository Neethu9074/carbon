/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Option } from 'react-select/src/filters';
import Select from 'react-select';
import React from 'react';

import { t } from 'in-i18n';

import './DropDownDirection.less';
import './ComboBox.less';

export default function ComboBox({ isClearable = true, ...props }) {
  /**
   * When props.value is null, then Array.find operation will return undefined
   * Select expects value to be null if wanted to reset the value
   */
  const value = props.options?.find((option: Option) => option.value === props.value) ?? null;
  return (
    <Select
      {...props}
      isClearable={isClearable}
      classNamePrefix="Select"
      className={`${props.className} Select`}
      placeholder={props.placeholder ? props.placeholder : t('in-components:comboBox.placeholderSelect')}
      onChange={(option: Option | null) => {
        if (option?.value !== props.value) {
          props.onChange(option);
        }
      }}
      value={value}
    />
  );
}
