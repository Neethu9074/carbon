/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/dialog/trackingHelpers';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import Dropdown from 'in-alerting/components/Dropdown';

export function ThresholdOperatorDropDown({ form, updateForm, customOnChange, trackingCallback, allOptions }) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = allOptions ? thresholdOperatorOptions : enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const value = (findEntryByValue(options, operatorValue) ?? options[0]).value;

  return (
    <Dropdown
      value={value}
      items={options}
      onChange={value => {
        if (customOnChange) {
          customOnChange(value);
        } else {
          updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(value).setTouched(true)));
        }
        trackingCallback?.(getTrackingObject(form, { value }));
      }}
    />
  );
}

ThresholdOperatorDropDown.propTypes = {
  form: PropTypes.object.isRequired,
  customOnChange: PropTypes.func, // optional, invoked `customOnChange(newValue)`
  updateForm: PropTypes.func, // used by default, when no customOnChange given
  trackingCallback: PropTypes.func,
  allOptions: PropTypes.bool
};
