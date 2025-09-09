/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useCallback } from 'react';

import { Checkbox, CheckboxGroup } from '@instana/carbon';
import { generateUniqueShortId } from '@instana/utils';

import { FilterCheckboxListProps } from 'in-synthetics/utils/constants';

/**
 * OptionCheckbox component for rendering individual option checkboxes
 */
const OptionCheckbox = ({
  option,
  isSelected,
  onChange,
  idPrefix
}: {
  option: { value: string; label: string };
  isSelected: boolean;
  onChange: (value: string, checked: boolean) => void;
  idPrefix: string;
}) => {
  // Create a stable ID based on the option value
  const checkboxId = useMemo(
    () => `${idPrefix}-option-${option.value.replace(/[^a-zA-Z0-9]/g, '-')}`,
    [idPrefix, option.value]
  );

  // Truncate label to first 35 characters for display
  const displayLabel = option.label.length > 35 ? `${option.label.slice(0, 35)}...` : option.label;

  return (
    <Checkbox
      key={option.value}
      title={option.label} // Full label as tooltip
      id={checkboxId}
      labelText={displayLabel}
      value={option.value}
      checked={isSelected}
      onChange={e => onChange(option.value, e.target.checked)}
      aria-label={option.label} // Keep full label for accessibility
    />
  );
};

/**
 * SimpleFilterCheckboxList component displays a list of checkboxes without search and select all functionality
 */
export function SimpleFilterCheckboxList({ selectedValues, options = [], onChange, groupId }: FilterCheckboxListProps) {
  // Generate a stable ID prefix for checkboxes
  const checkboxIdPrefix = useMemo(() => `${groupId || 'filter'}-${generateUniqueShortId()}`, [groupId]);

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      const updated = checked ? [...selectedValues, value] : selectedValues.filter(val => val !== value);
      onChange(updated);
    },
    [selectedValues, onChange]
  );

  return (
    <CheckboxGroup legendText="" orientation="vertical" aria-label="Filter options">
      {/* Option Checkboxes */}
      {options.map(option => (
        <OptionCheckbox
          key={option.value}
          option={option}
          isSelected={selectedValues.includes(option.value)}
          onChange={handleCheckboxChange}
          idPrefix={checkboxIdPrefix}
        />
      ))}
    </CheckboxGroup>
  );
}

// Made with Bob
