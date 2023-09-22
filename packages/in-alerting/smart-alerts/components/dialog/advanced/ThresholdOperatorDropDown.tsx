/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { Option } from 'in-components/ComboBox/ComboBox';
import Dropdown from 'in-alerting/components/Dropdown';

interface ThresholdOperatorDropDownProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  customOnChange?: (newOperator: any) => void;
  allOptions?: boolean;
}

export function ThresholdOperatorDropDown({
  form,
  updateForm,
  customOnChange,
  allOptions
}: ThresholdOperatorDropDownProps) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = allOptions ? thresholdOperatorOptions : enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const value = (findEntryByValue(options as Option[], operatorValue) ?? options[0])?.value;

  return (
    <Dropdown
      value={value as string}
      items={options as Option[]}
      onChange={value => {
        if (customOnChange) {
          customOnChange(value);
        } else {
          updateForm(
            form.updateIn(['threshold', 'operator'], f => (f as Field<string>).setValue(value).setTouched(true))
          );
        }
      }}
    />
  );
}
