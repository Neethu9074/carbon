/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Select } from '@instana/components';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { Option } from 'in-components/ComboBox/ComboBox';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown.mless';

interface ThresholdOperatorDropDownProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  customOnChange?: (newOperator: any) => void;
  allOptions?: boolean;
  isTearSheet?: boolean;
}

export function ThresholdOperatorDropDown({
  form,
  updateForm,
  customOnChange,
  allOptions,
  isTearSheet = false
}: ThresholdOperatorDropDownProps) {
  const operatorValue = form.get('threshold').get('operator').value;
  const options = allOptions ? thresholdOperatorOptions : enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const value = (findEntryByValue(options as Option[], operatorValue) ?? options[0])?.value;

  return isTearSheet ? (
    <Select
      value={value as string}
      onChange={e => {
        if (customOnChange) {
          customOnChange(e.target.value);
        } else {
          updateForm(
            form.updateIn(['threshold', 'operator'], f =>
              (f as Field<string>).setValue(e.target.value).setTouched(true)
            )
          );
        }
      }}
      className={classNames({ [locals.thresholdTypeMinWidth]: isTearSheet })}
    >
      {options.map(items => {
        return (
          <option key={items?.value} value={items?.value}>
            {items?.label}
          </option>
        );
      })}
    </Select>
  ) : (
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
