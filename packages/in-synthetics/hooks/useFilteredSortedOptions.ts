/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import { SortDirectionType, Option } from 'in-synthetics/components/constants';

/**
 * Custom hook to manage filtering, sorting and pagination of options for filter panel
 */
export const useFilteredSortedOptions = (
  options: Option[],
  searchQuery: string,
  sortDirection: SortDirectionType,
  visibleItems: number
) => {
  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  // Sort options based on sort direction
  const sortedOptions = useMemo(() => {
    if (sortDirection === 'NONE') return filteredOptions;

    return [...filteredOptions].sort((a, b) => {
      const cmp = a.label.localeCompare(b.label);
      return sortDirection === 'ASC' ? cmp : -cmp;
    });
  }, [filteredOptions, sortDirection]);

  // Get visible options based on pagination
  const visibleOptions = useMemo(() => {
    return sortedOptions.slice(0, visibleItems);
  }, [sortedOptions, visibleItems]);

  return {
    filteredOptions,
    sortedOptions,
    visibleOptions,
    hasMoreOptions: visibleItems < sortedOptions.length,
    totalCount: sortedOptions.length
  };
};
