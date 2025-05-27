/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Select } from '@instana/carbon';

import { timeAggregationOptions } from 'in-service-levels/constants';
import { TimeAggregationOptions } from 'in-service-levels/types';

interface AggregationSelectorInputProps {
  disabled?: boolean;
  hasError?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: AggregationType;
  availableOptions: TimeAggregationOptions[];
}

export default function AggregationSelectorInput({
  availableOptions,
  disabled = false,
  hasError = false,
  value,
  handleChange
}: AggregationSelectorInputProps) {
  return (
    <Select
      id="slo-select-aggregate"
      disabled={disabled}
      invalid={hasError}
      onChange={handleChange}
      value={value}
      size="sm"
      hideLabel
    >
      {availableOptions.map(value => {
        const label = timeAggregationOptions[value];
        return (
          <option value={value} key={value}>
            {label}
          </option>
        );
      })}
    </Select>
  );
}
