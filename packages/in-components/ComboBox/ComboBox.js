/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import React from 'react';

import autoMenuDirection from './autoMenuDirection';

import './DropDownDirection.less';
import './ComboBox.less';

export default autoMenuDirection(function ComboBox(props) {
  return (
    <Select
      {...props}
      onChange={e => {
        // react-select does not expose an event when the selected state is cleared.
        if ((!e && props.value != null) || e?.value !== props.value) {
          props.onChange(e);
        }
      }}
    />
  );
});
