/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Dropdown } from '@instana/components';

import { thresholdOperatorOptions } from 'in-custom-dashboards/widgets/_shared/Threshold/thresholdFormData';
import { findEntryByValue } from 'in-custom-dashboards/widgets/_shared/Threshold/formUtils';
import { Option } from 'in-components/ComboBox/ComboBox';

interface ThresholdOperatorDropDownProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  customOnChange?: (newOperator: any) => void;
}

export function ThresholdOperatorDropDown({ form, updateForm, customOnChange }: ThresholdOperatorDropDownProps) {
  const operatorValue = form.get('threshold').get('operator').value;
  const value = (findEntryByValue(thresholdOperatorOptions as Option[], operatorValue) ?? thresholdOperatorOptions[0])
    ?.value;

  return (
    <Dropdown
      value={value as string}
      items={thresholdOperatorOptions as Option[]}
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
