/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useMemo, useState } from 'react';

import { ColumnState, ListItem } from 'in-synthetics/components/constants';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';

// Custom hook for managing column configuration
export function useColumnConfiguration<ITEM_TYPE extends ListItem>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[],
  visibleColumns: { id: string }[]
) {
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    columnDefinitions.map(col => ({
      id: col.id,
      visible: visibleColumns.some(vc => vc.id === col.id),
      optional: col.optional
    }))
  );

  const enabledColumns = useMemo(() => columnStates.filter(cs => cs.visible).map(cs => cs.id), [columnStates]);

  const disabledColumns = useMemo(() => columnStates.filter(cs => !cs.visible).map(cs => cs.id), [columnStates]);

  const toggleColumnVisibility = useCallback((columnId: string, visible: boolean) => {
    setColumnStates(prev => prev.map(col => (col.id === columnId ? { ...col, visible } : col)));
  }, []);

  const setMultipleColumnsVisibility = useCallback((columnIds: string[], visible: boolean) => {
    setColumnStates(prev =>
      prev.map(col => {
        if (!col.optional || !columnIds.includes(col.id)) return col;
        return { ...col, visible };
      })
    );
  }, []);

  return {
    columnStates,
    setColumnStates,
    enabledColumns,
    disabledColumns,
    toggleColumnVisibility,
    setMultipleColumnsVisibility
  };
}
