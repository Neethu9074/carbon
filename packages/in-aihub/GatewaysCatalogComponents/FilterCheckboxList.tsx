/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo, useCallback } from 'react';

import { Checkbox, CheckboxGroup, Search, Button } from '@instana/carbon';
import { generateUniqueShortId } from '@instana/utils';

import { t } from 'in-i18n';

import locals from './GatewaysFilterBar.mless';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterCheckboxListProps {
  selectedValues: string[];
  options: Array<string | FilterOption>;
  onChange: (values: string[]) => void;
  groupId: string;
}

/**
 * FilterCheckboxList component displays a list of checkboxes with search functionality
 */
export function FilterCheckboxList({ selectedValues, options = [], onChange, groupId }: FilterCheckboxListProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleItems, setVisibleItems] = useState(10);

  // Normalize options to FilterOption format
  const normalizedOptions = useMemo(() => {
    return options.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }
      return option;
    });
  }, [options]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) {
      return normalizedOptions;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      option => option.label.toLowerCase().includes(lowerQuery) || option.value.toLowerCase().includes(lowerQuery)
    );
  }, [normalizedOptions, searchQuery]);

  // Get visible options based on pagination
  const visibleOptions = useMemo(() => {
    return filteredOptions.slice(0, visibleItems);
  }, [filteredOptions, visibleItems]);

  // Check if there are more options to load
  const hasMoreOptions = filteredOptions.length > visibleItems;

  // Event handlers
  const handleSearchChange = useCallback((e: { target: { value: string } }) => {
    setSearchQuery(e.target.value);
    setVisibleItems(10); // Reset pagination when search changes
  }, []);

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      const updated = checked ? [...selectedValues, value] : selectedValues.filter(val => val !== value);
      onChange(updated);
    },
    [selectedValues, onChange]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleItems(prev => prev + 10);
  }, []);

  // Generate a stable ID prefix for checkboxes
  const checkboxIdPrefix = useMemo(() => `${groupId || 'filter'}-${generateUniqueShortId()}`, [groupId]);

  return (
    <CheckboxGroup legendText="" orientation="vertical">
      {/* Search Input */}
      <div className={locals['checkBoxGroup_Search']}>
        <Search
          id={`${groupId}-search`}
          labelText=""
          value={searchQuery}
          placeholder={t('in-aihub:gateways.filterPanel.searchPlaceholder')}
          onChange={handleSearchChange}
          aria-label={t('in-aihub:gateways.filterPanel.searchPlaceholder')}
          size="sm"
        />
      </div>

      {/* Option Checkboxes */}
      {visibleOptions.map(option => {
        const checkboxId = `${checkboxIdPrefix}-option-${option.value.replace(/[^a-zA-Z0-9]/g, '-')}`;
        return (
          <Checkbox
            key={option.value}
            id={checkboxId}
            labelText={option.label}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={e => handleCheckboxChange(option.value, e.target.checked)}
            aria-label={option.label}
          />
        );
      })}

      {/* Load More Button */}
      {hasMoreOptions && (
        <Button
          kind="ghost"
          onClick={handleLoadMore}
          aria-label={t('in-aihub:gateways.filterPanel.viewAllLabel', {
            totalEntityCount: filteredOptions.length
          })}
          size="sm"
        >
          {t('in-aihub:gateways.filterPanel.viewAllLabel', {
            totalEntityCount: filteredOptions.length
          })}
        </Button>
      )}
    </CheckboxGroup>
  );
}
