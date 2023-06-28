/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CreatableSelect from 'react-select/creatable';
import React from 'react';

import './ComboBox.less';

export default function CreatableComboBox({ isClearable = true, ...props }) {
  return (
    <CreatableSelect
      {...props}
      isClearable={isClearable}
      classNamePrefix="Select"
      className={`${props.className} Select`}
    />
  );
}
