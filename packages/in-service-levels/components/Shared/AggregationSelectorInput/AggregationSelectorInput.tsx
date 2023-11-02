/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';

import { timeAggregationOptions } from 'in-service-levels/constants';
import Select from 'in-components/form/Select';

interface AggregationSelectorInputProps {
  disabled?: boolean;
  hasError?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: AggregationType;
}

export default function AggregationSelectorInput({
  disabled = false,
  hasError = false,
  value,
  handleChange
}: AggregationSelectorInputProps) {
  return (
    <Select disabled={disabled} hasError={hasError} onChange={handleChange} value={value}>
      {timeAggregationOptions.map(({ label, value }) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
