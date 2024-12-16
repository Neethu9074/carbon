/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import { Dropdown } from '@instana/components';

import { humanReadableThresholdOperator } from 'in-components/Threshold/threshold';
import { Option, Options } from 'in-components/ComboBox/ComboBox';
import { ThresholdOperator } from 'in-types';

const thresholdOperatorOptions: Options = Array.from(humanReadableThresholdOperator).map(([value, label]) => ({
  label,
  value
}));

interface ThresholdOperatorDropDownProps {
  field: Field<ThresholdOperator>;
  onChange: (newValue: ThresholdOperator) => void;
}

export default function ThresholdOperatorDropDown({ field, onChange }: ThresholdOperatorDropDownProps) {
  // Dropdown does not export DropdownItems, using Option as a replacement with same structure
  return <Dropdown value={field.value as string} items={thresholdOperatorOptions as Option[]} onChange={onChange} />;
}
