/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { ChangeEvent, CSSProperties, useCallback, useMemo, useState } from 'react';
import { Column, Draggable } from '@carbon/icons-react';
import { CSS } from '@dnd-kit/utilities';

import {
  Checkbox,
  DataTable,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch
} from '@instana/carbon';
import { TearsheetNarrow } from '@instana/ibm-products';

import {
  CellValue,
  ColumnState,
  ConfigureColumnsProps,
  ConfigureColumnsTearsheetProps,
  ListItem,
  Row
} from 'in-synthetics/components/constants';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from './ConfigureColumns.mless';

export function ConfigureColumns<ITEM_TYPE extends ListItem>({
  columnDefinitions,
  visibleColumns,
  disabledColumns,
  isResultLoading,
  onSubmit
}: ConfigureColumnsProps<ITEM_TYPE>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        kind="ghost"
        label={t('in-synthetics:dashboard.testList.configureColumns.dialog.configureButtonLabel')}
        onClick={() => setIsOpen(true)}
        disabled={isResultLoading}
      >
        <Column />
      </IconButton>
      {isOpen && (
        <ConfigureColumnsTearsheet
          columnDefinitions={columnDefinitions}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onSubmit={onSubmit}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

function SortableItem<ITEM_TYPE extends ListItem>({
  id,
  row,
  columnDefinitions,
  orderedRowIds,
  setColumnStates,
  setColDefinitions
}: {
  id: string;
  row: Row | undefined;
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[];
  orderedRowIds: string[];
  setColumnStates: React.Dispatch<React.SetStateAction<ColumnState[]>>;
  setColDefinitions: React.Dispatch<React.SetStateAction<ColumnDefinition<ITEM_TYPE>[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab'
  } as CSSProperties;

  const handleColumnChecked = (columnId: string, checked: boolean) => {
    const isVisible = orderedRowIds.includes(columnId);
    const column = columnDefinitions.find(col => col.id === columnId);

    if (!isVisible || !column?.optional) return;

    setColumnStates(prev => prev.map(col => (col.id === columnId ? { ...col, visible: checked } : col)));

    const columnDefinitionsSorted = orderedRowIds
      .map(id => columnDefinitions.find(col => col.id === id))
      .filter(Boolean) as ColumnDefinition<ITEM_TYPE>[];

    setColDefinitions(columnDefinitionsSorted);
  };

  return (
    // populates each row
    <tr
      ref={setNodeRef}
      className="cds--data-table__row"
      style={style}
      {...(!isDragging ? { ...attributes, ...listeners } : {})}
      // allows checkbox clicks while using the row as a drag handle
      onPointerDown={e => {
        const isInteractive = (e.target as HTMLElement).closest('input, label');
        if (!isInteractive) {
          listeners?.onPointerDown?.(e);
        }
      }}
    >
      {row?.cells?.map(cell => {
        const colKey = cell.info.header;

        if (colKey === 'icon') {
          // draggable icon
          return (
            <TableCell key={cell.id}>
              <Draggable />
            </TableCell>
          );
        }

        if (colKey === 'action') {
          const { id: columnId, optional, isChecked } = cell.value as CellValue;
          // checkbox
          return (
            <TableCell key={cell.id}>
              <Checkbox
                id={`checkbox-${columnId}`}
                checked={isChecked}
                disabled={!optional}
                onChange={() => handleColumnChecked(columnId, !isChecked)}
                labelText=""
              />
            </TableCell>
          );
        }
        // column name
        return <TableCell key={cell.id}>{cell.value}</TableCell>;
      })}
    </tr>
  );
}

// Custom hook for managing column configuration
function useColumnConfiguration<ITEM_TYPE extends ListItem>(
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

// Custom hook for column reordering
function useColumnReordering<ITEM_TYPE extends ListItem>(
  columnDefinitions: ColumnDefinition<ITEM_TYPE>[],
  enabledColumns: string[]
) {
  const columnDefinitionsMap = useMemo(
    () => Object.fromEntries(columnDefinitions.map(col => [col.id, col])),
    [columnDefinitions]
  );

  const [colDefinitions, setColDefinitions] = useState<ColumnDefinition<ITEM_TYPE>[]>(columnDefinitions);

  const [orderedRowIds, setOrderedRowIds] = useState<string[]>(() =>
    columnDefinitions
      .slice()
      .sort(
        (a, b) =>
          Number(!b.optional || enabledColumns.includes(b.id)) - Number(!a.optional || enabledColumns.includes(a.id))
      )
      .map(col => col.id)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = orderedRowIds.findIndex(id => id === active.id);
      const newIndex = orderedRowIds.findIndex(id => id === over.id);
      const newOrderIds = arrayMove(orderedRowIds, oldIndex, newIndex);

      setOrderedRowIds(newOrderIds);
      const columnDefinitionsSorted = newOrderIds.map(id => columnDefinitionsMap[id]).filter(Boolean);

      setColDefinitions(columnDefinitionsSorted);
    },
    [orderedRowIds, columnDefinitionsMap]
  );

  return {
    colDefinitions,
    setColDefinitions,
    orderedRowIds,
    setOrderedRowIds,
    handleDragEnd
  };
}

// Search filter utility function
function filterRowsBySearch(rows: Row[], searchQuery?: string): Row[] {
  if (!searchQuery) return rows;

  const lowerCaseQuery = searchQuery.toLowerCase();
  return rows.filter(row =>
    row.cells.some(
      cell =>
        cell.info.header === 'name' &&
        typeof cell.value === 'string' &&
        cell.value.toLowerCase().includes(lowerCaseQuery)
    )
  );
}

// Column table toolbar component
const ColumnTableToolbar = React.memo(({ onSearch }: { onSearch: (query: string) => void }) => {
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value;
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <TableToolbar>
      <TableToolbarContent>
        <TableToolbarSearch
          className={locals.searchBox}
          defaultExpanded
          onChange={handleSearch}
          placeholder={t('in-synthetics:dashboard.testList.configureColumns.dialog.searchPlaceholder')}
        />
      </TableToolbarContent>
    </TableToolbar>
  );
});

// Column table header component
const ColumnTableHeader = React.memo(
  ({
    headers,
    getHeaderProps,
    allRowsEnabled,
    someRowsEnabled,
    onSelectAllChange
  }: {
    headers: { key: string; header: React.ReactNode }[];
    getHeaderProps: (props: { header: { key: string; header: React.ReactNode } }) => object;
    allRowsEnabled: boolean;
    someRowsEnabled: boolean;
    onSelectAllChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return (
      <TableHead>
        <TableRow>
          {headers.map(header => (
            <TableHeader key={header.key} {...getHeaderProps({ header })}>
              {header.key === 'action' ? (
                <Checkbox
                  id="select-all"
                  checked={allRowsEnabled}
                  indeterminate={someRowsEnabled && !allRowsEnabled}
                  onChange={onSelectAllChange}
                  labelText=""
                  aria-label={t('in-synthetics:dashboard.testList.configureColumns.dialog.selectAllLabel')}
                />
              ) : (
                header.header
              )}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
    );
  }
);

function ConfigureColumnsTearsheet<ITEM_TYPE extends ListItem>({
  columnDefinitions,
  visibleColumns,
  onSubmit,
  setIsOpen
}: ConfigureColumnsTearsheetProps<ITEM_TYPE>) {
  // Use custom hooks for state management
  const { columnStates, setColumnStates, enabledColumns, disabledColumns, setMultipleColumnsVisibility } =
    useColumnConfiguration<ITEM_TYPE>(columnDefinitions, visibleColumns);

  const { colDefinitions, setColDefinitions, orderedRowIds, handleDragEnd } = useColumnReordering<ITEM_TYPE>(
    columnDefinitions,
    enabledColumns
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Table configuration
  const headers = useMemo(
    () =>
      [
        { key: 'icon', header: '' },
        { key: 'action', header: '' },
        { key: 'name', header: t('in-synthetics:dashboard.testList.configureColumns.dialog.columnNameLabel') }
      ] as { key: string; header: React.ReactNode }[],
    []
  );

  // Create rows data with memoization
  const unfilteredRows = useMemo(
    () =>
      orderedRowIds
        .map(id => {
          const col = columnDefinitions.find(col => col.id === id);
          if (!col) return null;

          const colState = columnStates.find(cs => cs.id === id);
          const isChecked = !col.optional || colState?.visible;

          return {
            id,
            cells: [
              { id: `icon-${id}`, info: { header: 'icon' }, value: 'draggable' },
              { id: `action-${id}`, info: { header: 'action' }, value: { id, optional: col.optional, isChecked } },
              { id: `name-${id}`, info: { header: 'name' }, value: col.label }
            ]
          };
        })
        .filter(Boolean) as Row[],
    [orderedRowIds, columnDefinitions, columnStates]
  );

  // Apply search filter with memoization
  const rows = useMemo(() => filterRowsBySearch(unfilteredRows, searchQuery), [unfilteredRows, searchQuery]);

  // Row selection state with memoization
  const { allRowsEnabled, someRowsEnabled } = useMemo(
    () => ({
      allRowsEnabled: rows.every(row => columnStates.find(cs => cs.id === row.id)?.visible),
      someRowsEnabled: rows.some(row => columnStates.find(cs => cs.id === row.id)?.visible)
    }),
    [rows, columnStates]
  );

  // DnD configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  // Event handlers with useCallback
  const handleSelectAllCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allRowIds = rows.map(row => row.id);
      setMultipleColumnsVisibility(allRowIds, e.target.checked);
    },
    [rows, setMultipleColumnsVisibility]
  );

  const handleSave = useCallback(() => {
    try {
      onSubmit({
        enabledColumns,
        disabledColumns
      });

      trySet('disabledColumns', JSON.stringify(disabledColumns));
      trySet('enabledColumns', JSON.stringify(enabledColumns));
      trySet('columnDefinitions', JSON.stringify(colDefinitions));

      addMessage({
        type: 'success',
        timeout: 5000,
        title: t('in-synthetics:dashboard.testList.configureColumns.dialog.configurationSuccessTitle'),
        content: t('in-synthetics:dashboard.testList.configureColumns.dialog.configurationSuccessMessage')
      });
    } catch {
      addMessage({
        type: 'danger',
        timeout: 5000,
        title: t('in-synthetics:dashboard.testList.configureColumns.dialog.configurationErrorTitle'),
        content: t('in-synthetics:dashboard.testList.configureColumns.dialog.configurationErrorMessage')
      });
    }
    setIsOpen(false);
  }, [enabledColumns, disabledColumns, colDefinitions, onSubmit, setIsOpen]);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    // @ts-expect-error
    <TearsheetNarrow
      open
      className={locals.configureColumns}
      onClose={handleClose}
      hasCloseIcon
      closeIconDescription={t('in-synthetics:dashboard.testList.configureColumns.dialog.closeIconDescription')}
      title={t('in-synthetics:dashboard.testList.configureColumns.dialog.title', {
        enabledCount: enabledColumns.length,
        totalCount: columnDefinitions.length
      })}
      description={t('in-synthetics:dashboard.testList.configureColumns.dialog.description')}
      actions={[
        {
          key: 'save',
          kind: 'primary',
          label: t('in-synthetics:dashboard.testList.configureColumns.dialog.saveButtonLabel'),
          onClick: handleSave
        },
        {
          key: 'close',
          kind: 'ghost',
          label: t('in-synthetics:dashboard.testList.configureColumns.dialog.cancelButtonLabel'),
          onClick: handleClose
        }
      ]}
    >
      <DataTable rows={rows} headers={headers}>
        {({ headers, getTableProps, getHeaderProps }) => (
          <TableContainer>
            <ColumnTableToolbar onSearch={setSearchQuery} />
            <Table {...getTableProps()}>
              <ColumnTableHeader
                headers={headers}
                getHeaderProps={getHeaderProps}
                allRowsEnabled={allRowsEnabled}
                someRowsEnabled={someRowsEnabled}
                onSelectAllChange={handleSelectAllCheck}
              />
              <TableBody>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={orderedRowIds} strategy={verticalListSortingStrategy}>
                    {orderedRowIds.map((orderedRowId: string) => {
                      const row = rows.find((r: { id: string }) => r.id === orderedRowId);
                      return (
                        row && (
                          <SortableItem
                            id={orderedRowId}
                            key={orderedRowId}
                            row={row}
                            columnDefinitions={colDefinitions}
                            orderedRowIds={orderedRowIds}
                            setColumnStates={setColumnStates}
                            setColDefinitions={setColDefinitions}
                          />
                        )
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </TearsheetNarrow>
  );
}
