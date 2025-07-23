/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import { getFromLocalStorage, getVisibleColumns } from 'in-synthetics/components/utils';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListItem } from 'in-synthetics/components/constants';
import { tryGet } from 'in-services/localStorage';

/**
 * Hook to manage column definitions, visibility, and related state
 */
export function useColumnManagement<ITEM_TYPE extends ListItem>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[],
  optionalColumns: ColumnDefinition<ITEM_TYPE>[] = [],
  disabledColumns?: string[],
  enabledColumns?: string[]
) {
  // Get raw localStorage value to use as a dependency for useMemo
  const rawColumnDefinitionsFromStorage = tryGet('columnDefinitions');

  // Parse column definitions from localStorage or use provided definitions
  const columnDefinitionsParsed = useMemo(() => {
    let parsedColumns = getFromLocalStorage<ColumnDefinition<ITEM_TYPE>[]>('columnDefinitions', columnDefinitions);

    // If we have stored column definitions, restore the getContent function from original definitions
    if (rawColumnDefinitionsFromStorage) {
      parsedColumns = parsedColumns.map(colDef => {
        const original = columnDefinitions.find(def => def.id === colDef.id);
        return {
          ...original,
          ...colDef
        };
      });
    }

    return parsedColumns;
  }, [columnDefinitions, rawColumnDefinitionsFromStorage]);

  // Parse disabled columns from localStorage or use provided values
  const disabledColumnsParsed = useMemo(
    () => getFromLocalStorage<string[]>('disabledColumns', disabledColumns ?? []),
    [disabledColumns]
  );

  // Parse enabled columns from localStorage or use provided values
  const enabledColumnsParsed = useMemo(
    () => getFromLocalStorage<string[]>('enabledColumns', enabledColumns ?? []),
    [enabledColumns]
  );

  // Calculate visible columns based on parsed values
  const visibleColumns = useMemo(
    () => getVisibleColumns(columnDefinitionsParsed, optionalColumns, disabledColumnsParsed, enabledColumnsParsed),
    [columnDefinitionsParsed, optionalColumns, disabledColumnsParsed, enabledColumnsParsed]
  );

  return {
    columnDefinitionsParsed,
    disabledColumnsParsed,
    visibleColumns
  };
}
