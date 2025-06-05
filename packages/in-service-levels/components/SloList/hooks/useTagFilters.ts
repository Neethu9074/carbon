/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ColumnFilter } from '@tanstack/react-table';
import { useMemo } from 'react';

import { generateStableHash } from '@instana/utils';

export interface UseTagFiltersParams {
  columnFilters: ColumnFilter[];
  setLocalFilters: (change: ColumnFilter[]) => void;
  setFilter: (change: ColumnFilter[]) => void;
  getFilterLabel: ({ id, value }: { value: string | string[]; id: string }) => string;
}

export default function useTagFilters({
  columnFilters,
  setLocalFilters,
  setFilter,
  getFilterLabel
}: UseTagFiltersParams) {
  return useMemo(() => {
    const buildTag = (col: ColumnFilter) => {
      const id = col.id;
      const value = col.value;

      if (Array.isArray(value)) {
        return value.map(val => ({
          id: `${id}-${val}`,
          label: getFilterLabel({ id, value: val }),
          onClose: () => {
            const updatedValue = value.filter(v => v !== val);
            const newFilters = updatedValue.length
              ? [...columnFilters.filter(f => f.id !== id), { id, value: updatedValue }]
              : columnFilters.filter(f => f.id !== id);

            setFilter(newFilters);
            setLocalFilters(newFilters);
          }
        }));
      }

      return [
        {
          id: `${id}-${value}`,
          label: getFilterLabel({ id, value: value as string }),
          onClose: () => {
            const newFilters = columnFilters.map(f => (f.id === id ? { ...f, value: undefined } : f));
            setFilter(newFilters);
            setLocalFilters(newFilters);
          }
        }
      ];
    };

    return columnFilters.flatMap(buildTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(columnFilters), setFilter, setLocalFilters, getFilterLabel]);
}
