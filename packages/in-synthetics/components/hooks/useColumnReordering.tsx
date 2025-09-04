/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';

import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListItem } from 'in-synthetics/components/constants';

/**
 * Determines if a column is a disabled column (name or action)
 * @param columnId - The column ID to check
 * @param columnLabel - The column label to check
 * @param type - The type of disabled column to check for ('name' or 'action')
 */
const isDisabledColumn = (columnId: string, columnLabel: string | undefined, type: 'test_name' | 'action'): boolean => {
  const id = columnId.toLowerCase();
  const label = columnLabel?.toLowerCase() || '';

  return id === type || label === type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Creates an initially sorted array of column IDs based on enabled status and disabled column positions
 * @param columnDefinitions - The column definitions to sort
 * @param enabledColumns - The IDs of enabled columns
 */
const createInitialColumnOrder = <ITEM_TYPE extends ListItem>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[],
  enabledColumns: string[]
): string[] => {
  // First sort columns by enabled status
  const sorted = columnDefinitions
    .slice()
    .sort(
      (a, b) =>
        Number(!b.optional || enabledColumns.includes(b.id)) - Number(!a.optional || enabledColumns.includes(a.id))
    );

  // Find the name column if it exists
  const nameColumnIndex = sorted.findIndex(col => isDisabledColumn(col.id, col.label, 'test_name'));

  // Find the action column if it exists
  const actionColumnIndex = sorted.findIndex(col => isDisabledColumn(col.id, col.label, 'action'));

  // If name column exists, move it to the beginning
  if (nameColumnIndex !== -1) {
    const nameColumn = sorted.splice(nameColumnIndex, 1)[0];
    sorted.unshift(nameColumn);
  }

  // If action column exists, move it after the last checked/enabled column
  if (actionColumnIndex !== -1) {
    // Need to recalculate index since the array may have changed
    const newActionIndex = sorted.findIndex(col => isDisabledColumn(col.id, col.label, 'action'));
    if (newActionIndex !== -1) {
      const actionColumn = sorted.splice(newActionIndex, 1)[0];

      // Find the index of the last enabled column
      const lastEnabledIndex = sorted.findLastIndex(col => !col.optional || enabledColumns.includes(col.id));

      // Insert the action column after the last enabled column
      sorted.splice(lastEnabledIndex + 1, 0, actionColumn);
    }
  }

  return sorted.map(col => col.id);
};

/**
 * Creates sorted column definitions based on the ordered IDs
 * @param orderedIds - The ordered column IDs
 * @param columnDefinitionsMap - Map of column definitions by ID
 */
const createSortedColumnDefinitions = <ITEM_TYPE extends ListItem>(
  orderedIds: string[],
  columnDefinitionsMap: Record<string, ColumnDefinition<ITEM_TYPE>>
): ColumnDefinition<ITEM_TYPE>[] => {
  return orderedIds.map(id => columnDefinitionsMap[id]).filter(Boolean);
};

// Custom hook for column reordering
export function useColumnReordering<ITEM_TYPE extends ListItem>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[],
  enabledColumns: string[]
) {
  // Create a map of column definitions for quick lookup
  const columnDefinitionsMap = useMemo(
    () => Object.fromEntries(columnDefinitions.map(col => [col.id, col])),
    [columnDefinitions]
  );

  // Initialize ordered row IDs with memoization
  const initialOrderedRowIds = useMemo(
    () => createInitialColumnOrder(columnDefinitions, enabledColumns),
    [columnDefinitions, enabledColumns]
  );

  const [orderedRowIds, setOrderedRowIds] = useState<string[]>(initialOrderedRowIds);

  // Initialize column definitions with memoization
  const initialColDefinitions = useMemo(
    () => createSortedColumnDefinitions(initialOrderedRowIds, columnDefinitionsMap),
    [initialOrderedRowIds, columnDefinitionsMap]
  );

  const [colDefinitions, setColDefinitions] = useState<ColumnDefinition<ITEM_TYPE>[]>(initialColDefinitions);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = orderedRowIds.findIndex(id => id === active.id);
      const newIndex = orderedRowIds.findIndex(id => id === over.id);

      // Find Name column index (should be at the beginning)
      const nameColumnIndex = orderedRowIds.findIndex(id => {
        const col = columnDefinitionsMap[id];
        return col && isDisabledColumn(col.id, col.label, 'test_name');
      });

      // Find Action column index (should be at the end)
      const actionColumnIndex = orderedRowIds.findIndex(id => {
        const col = columnDefinitionsMap[id];
        return col && isDisabledColumn(col.id, col.label, 'action');
      });

      // Get the column being dragged
      const draggedColumn = columnDefinitionsMap[active.id];

      // Check if the dragged column is checked/enabled
      const isDraggedColumnEnabled = !draggedColumn.optional || enabledColumns.includes(draggedColumn.id);

      // Prevent dragging before Name column and checked columns below Action column
      if (
        (nameColumnIndex !== -1 && newIndex <= nameColumnIndex) ||
        (isDraggedColumnEnabled && actionColumnIndex !== -1 && newIndex >= actionColumnIndex)
      ) {
        return; // Cancel the drag operation
      }

      const newOrderIds = arrayMove(orderedRowIds, oldIndex, newIndex);
      const columnDefinitionsSorted = createSortedColumnDefinitions(newOrderIds, columnDefinitionsMap);

      setOrderedRowIds(newOrderIds);
      setColDefinitions(columnDefinitionsSorted);
    },
    [orderedRowIds, columnDefinitionsMap, enabledColumns]
  );

  return {
    colDefinitions,
    setColDefinitions,
    orderedRowIds,
    setOrderedRowIds,
    handleDragEnd
  };
}
