/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ThresholdOperator, SLIThresholdOperator } from '@instana/types';
import { Select } from '@instana/components';

import locals from './OperatorDropdown.mless';

interface OperatorDropdownProps<OPERATOR extends ThresholdOperator | SLIThresholdOperator> {
  operators: OPERATOR[];
  value: OPERATOR;
  onChange: (operator: OPERATOR) => void;
  disabled?: boolean;
}

export default function OperatorDropdown<OPERATOR extends ThresholdOperator | SLIThresholdOperator>({
  operators,
  value,
  onChange,
  disabled = false
}: OperatorDropdownProps<OPERATOR>) {
  return (
    <div className={locals.dropdownContainer}>
      <Select
        disabled={disabled}
        onChange={e => {
          onChange(e.target.value as OPERATOR);
        }}
        value={value}
      >
        {operators.map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </Select>
    </div>
  );
}
