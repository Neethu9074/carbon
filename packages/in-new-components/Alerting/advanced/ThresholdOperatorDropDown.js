/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-new-components/Alerting/advanced/thresholdFormData';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { findEntryByValue } from 'in-new-components/Alerting/utils/formUtils';
import Dropdown from 'in-new-components/Alerting/Dropdown';

export function ThresholdOperatorDropDown({ form, onChange, customOnChange, trackingCallback, allOptions }) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = allOptions ? thresholdOperatorOptions : enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const label = (findEntryByValue(options, operatorValue) ?? options[0]).label;

  return (
    <Dropdown
      asSimpleDropdown
      label={label}
      items={options}
      onChange={({ value = '' }) => {
        if (customOnChange) {
          customOnChange(value);
        } else {
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
        }
        trackingCallback?.(getTrackingObject(form, { value }));
      }}
    />
  );
}

ThresholdOperatorDropDown.propTypes = {
  form: PropTypes.object.isRequired,
  customOnChange: PropTypes.func, // optional, invoked `customOnChange(newValue)`
  onChange: PropTypes.func, // used by default, when no customOnChange given
  trackingCallback: PropTypes.func,
  allOptions: PropTypes.bool
};
