/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import 'react-select/dist/react-select.css';
import Select from 'react-select';
import React from 'react';

import autoMenuDirection from './autoMenuDirection';
import { t } from 'in-i18n';

import './DropDownDirection.less';
import './ComboBox.less';

export default autoMenuDirection(function ComboBox(props) {
  return (
    <Select
      {...props}
      placeholder={props.placeholder ? props.placeholder : t('in-components:comboBox.placeholderSelect')}
      onChange={e => {
        // react-select does not expose an event when the selected state is cleared.
        if ((!e && props.value != null) || e?.value !== props.value) {
          props.onChange(e);
        }
      }}
    />
  );
});
