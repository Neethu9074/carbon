/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Select from 'react-select';
import React from 'react';

import autoMenuDirection from './autoMenuDirection';
import { t } from 'in-i18n';

import './DropDownDirection.less';
import './ComboBox.less';

export default autoMenuDirection(function ComboBox({ isClearable = true, ...props }) {
  /**
   * When props.value is null, then Array.find operation will return undefined
   * Select expects value to be null if wanted to reset the value
   */
  const value = props.options?.find(option => option.value === props.value) ?? null;
  return (
    <Select
      {...props}
      isClearable={isClearable}
      classNamePrefix="Select"
      className={`${props.className} Select`}
      placeholder={props.placeholder ? props.placeholder : t('in-components:comboBox.placeholderSelect')}
      onChange={e => {
        if (e?.value !== props.value) {
          props.onChange(e);
        }
      }}
      value={value}
    />
  );
});
