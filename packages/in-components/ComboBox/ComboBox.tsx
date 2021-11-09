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
  const value =
    props.options?.filter((option: Option) =>
      Array.isArray(props.value) ? props.value.includes(option.value) : option.value === props.value
    ) ?? null;
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
