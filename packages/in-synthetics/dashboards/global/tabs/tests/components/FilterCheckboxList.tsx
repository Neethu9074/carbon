/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo, useCallback } from 'react';

import { Checkbox, CheckboxGroup, Search, IconButton, Button, Layer } from '@instana/carbon';
import { generateUniqueShortId } from '@instana/utils';

import { useFilteredSortedOptions } from 'in-synthetics/components/hooks/useFilteredSortedOptions';
import { getNextSortDirection, getSortIcon } from 'in-synthetics/dashboards/global/utils';
import { useFilterPagination } from 'in-synthetics/components/hooks/useFilterPagination';
import { useSelectionState } from 'in-synthetics/components/hooks/useSelectionState';
import { FilterCheckboxListProps } from 'in-synthetics/utils/constants';
import { SortDirectionType } from 'in-synthetics/components/constants';
import { t } from 'in-i18n';

import locals from './TestListFilters.mless';

/**
 * Search and Sort Header component
 */
const FilterHeader = ({
  searchQuery,
  onSearchChange,
  sortDirection,
  onSortChange,
  groupId
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortDirection: SortDirectionType;
  onSortChange: () => void;
  groupId: string;
}) => (
  <Layer className={locals.searchSortWrapper}>
    <Search
      id={`${groupId}-search`}
      labelText=""
      value={searchQuery}
      placeholder={t('in-synthetics:dashboard.testList.filterPanel.searchPlaceholder')}
      onChange={e => onSearchChange(e.target.value)}
      aria-label={t('in-synthetics:dashboard.testList.filterPanel.searchPlaceholder')}
    />
    <IconButton
      kind="ghost"
      label={t('in-synthetics:dashboard.testList.filterPanel.sortLabel')}
      onClick={onSortChange}
      size="md"
      aria-label={t('in-synthetics:dashboard.testList.filterPanel.sortLabel')}
      title={t('in-synthetics:dashboard.testList.filterPanel.sortLabel')}
    >
      {getSortIcon(sortDirection)}
    </IconButton>
  </Layer>
);

/**
 * SelectAll checkbox component
 */
const SelectAllCheckbox = ({
  allSelected,
  isIndeterminate,
  onSelectAll,
  totalCount,
  groupId
}: {
  allSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  totalCount: number;
  groupId: string;
}) => (
  <Checkbox
    id={`${groupId}-select-all`}
    labelText={t('in-synthetics:dashboard.testList.filterPanel.selectAllLabel', {
      totalEntityCount: totalCount
    })}
    checked={allSelected}
    indeterminate={isIndeterminate}
    onChange={e => onSelectAll(e.target.checked)}
    aria-label={t('in-synthetics:dashboard.testList.filterPanel.selectAllLabel', {
      totalEntityCount: totalCount
    })}
  />
);

/**
 * LoadMore button component
 */
const LoadMoreButton = ({ onClick, totalCount }: { onClick: (e: React.MouseEvent) => void; totalCount: number }) => (
  <Button
    kind="ghost"
    onClick={onClick}
    aria-label={t('in-synthetics:dashboard.testList.filterPanel.viewAllLabel', {
      totalEntityCount: totalCount
    })}
  >
    {t('in-synthetics:dashboard.testList.filterPanel.viewAllLabel', {
      totalEntityCount: totalCount
    })}
  </Button>
);

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

  return (
    <Checkbox
      key={option.value}
      id={checkboxId}
      labelText={option.label}
      value={option.value}
      checked={isSelected}
      onChange={e => onChange(option.value, e.target.checked)}
      aria-label={option.label}
    />
  );
};

/**
 * FilterCheckboxList component displays a list of checkboxes with search and sort functionality
 */
export function FilterCheckboxList({ selectedValues, options = [], onChange, groupId }: FilterCheckboxListProps) {
  // Use custom hook for pagination
  const { visibleItems, handleLoadMore, resetPagination } = useFilterPagination(5, 10);

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('NONE');

  // Use custom hooks for filtering, sorting, and selection state
  const { sortedOptions, visibleOptions, hasMoreOptions, totalCount } = useFilteredSortedOptions(
    options,
    searchQuery,
    sortDirection,
    visibleItems
  );

  const { allSelected, isIndeterminate } = useSelectionState(selectedValues, sortedOptions.length);

  // Event handlers
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      resetPagination();
    },
    [resetPagination]
  );

  const handleSortChange = useCallback(() => {
    setSortDirection(prev => getNextSortDirection(prev));
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      onChange(checked ? sortedOptions.map(opt => opt.value) : []);
    },
    [onChange, sortedOptions]
  );

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      const updated = checked ? [...selectedValues, value] : selectedValues.filter(val => val !== value);
      onChange(updated);
    },
    [selectedValues, onChange]
  );

  // Generate a stable ID prefix for checkboxes
  const checkboxIdPrefix = useMemo(() => `${groupId || 'filter'}-${generateUniqueShortId()}`, [groupId]);

  return (
    <CheckboxGroup
      legendText=""
      orientation="vertical"
      aria-label={t('in-synthetics:dashboard.testList.filterPanel.selectAllLabel', {
        totalEntityCount: totalCount
      })}
    >
      {/* Search and Sort Header */}
      <FilterHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        groupId={groupId}
      />

      {/* Select All Checkbox */}
      <SelectAllCheckbox
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
        onSelectAll={handleSelectAll}
        totalCount={totalCount}
        groupId={groupId}
      />

      {/* Option Checkboxes */}
      {visibleOptions.map(option => (
        <OptionCheckbox
          key={option.value}
          option={option}
          isSelected={selectedValues.includes(option.value)}
          onChange={handleCheckboxChange}
          idPrefix={checkboxIdPrefix}
        />
      ))}

      {/* Load More Button */}
      {hasMoreOptions && <LoadMoreButton onClick={handleLoadMore} totalCount={totalCount} />}
    </CheckboxGroup>
  );
}
