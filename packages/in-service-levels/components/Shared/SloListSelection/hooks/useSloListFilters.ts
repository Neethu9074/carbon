/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';

import { SloEntityType } from '@instana/types';

export interface SloListFilterState {
  columnFilters: ColumnFiltersState;
  localFilters: ColumnFiltersState;
  resetFilters: () => void;
  toggleFilter: (entityType?: SloEntityType) => void;
  setColumnFiltersFromLocalFilters: () => void;
  resetLocalFiltersToColumnFilters: () => void;
  setFilters: (filters: ColumnFiltersState) => void;
}

export default function useSloListFilters(): SloListFilterState {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [localFilters, setLocalFilters] = useState<ColumnFiltersState>([]);

  const resetFilters = () => {
    setLocalFilters([]);
    setColumnFilters([]);
  };

  const toggleFilter = (entityType?: SloEntityType) => {
    setLocalFilters(localFilters => {
      if (!entityType) return [];
      const entityTypeFilter = localFilters.find(filter => filter.id === 'entityType');
      if (!entityTypeFilter || entityTypeFilter.value !== entityType) {
        return [{ id: 'entityType', value: entityType }];
      } else {
        return [];
      }
    });
  };

  const setColumnFiltersFromLocalFilters = () => {
    setColumnFilters(localFilters);
  };

  const resetLocalFiltersToColumnFilters = () => {
    setLocalFilters(columnFilters);
  };

  const setFilters = (filters: ColumnFiltersState) => {
    setLocalFilters(filters);
    setColumnFilters(filters);
  };

  return {
    columnFilters,
    localFilters,
    resetFilters,
    toggleFilter,
    setColumnFiltersFromLocalFilters,
    resetLocalFiltersToColumnFilters,
    setFilters
  };
}
