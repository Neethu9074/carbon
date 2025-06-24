/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CheckboxChecked, Column, Draggable } from '@carbon/icons-react';
import React, { ChangeEvent, CSSProperties, useState } from 'react';
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
  ConfigureColumnsProps,
  ConfigureColumnsTearsheetProps,
  ListItem,
  Row
} from 'in-synthetics/components/constants';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from './ConfigureColumns.mless';

export function ConfigureColumns<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>({
  columnDefinitions,
  visibleColumns,
  disabledColumns,
  isResultLoading,
  onSubmit
}: ConfigureColumnsProps<ITEM_TYPE, PROPS_TYPE>) {
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

const SortableItem = ({
  id,
  row,
  setDisabledCols,
  setEnabledColumns
}: {
  id: string;
  row: Row | undefined;
  setDisabledCols: React.Dispatch<React.SetStateAction<string[]>>;
  setEnabledColumns: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab'
  } as CSSProperties;

  const handleColumnChecked = (columnId: string, checked: boolean) => {
    if (checked) {
      setDisabledCols(prev => prev.filter(id => id !== columnId));
      setEnabledColumns(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
    } else {
      setEnabledColumns(prev => prev.filter(id => id !== columnId));
      setDisabledCols(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
    }
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
};

function ConfigureColumnsTearsheet<ITEM_TYPE extends ListItem, PROPS_TYPE extends TableProps<ITEM_TYPE>>({
  columnDefinitions,
  visibleColumns,
  disabledColumns,
  onSubmit,
  setIsOpen
}: ConfigureColumnsTearsheetProps<ITEM_TYPE, PROPS_TYPE>) {
  const [colDefinitions, setColDefinitions] = useState<ColumnDefinition<ITEM_TYPE, PROPS_TYPE>[]>(columnDefinitions);
  const [enabledColumns, setEnabledColumns] = useState<string[]>(visibleColumns.map(col => col.id));
  const [disabledCols, setDisabledCols] = useState<string[]>(disabledColumns);
  // maintains column order after drag-and-drop reordering
  const [orderedRowIds, setOrderedRowIds] = useState<string[]>(() =>
    colDefinitions
      .slice()
      // sort items so that checked checkboxes appear first with unchecked ones below
      .sort((a, b) => {
        return (
          Number(!b.optional || enabledColumns.includes(b.id)) - Number(!a.optional || enabledColumns.includes(a.id))
        );
      })
      .map(col => col.id)
  );
  const [searchQuery, setSearchQuery] = useState<string>();

  const headers = [
    { key: 'icon', header: '' },
    { key: 'action', header: '', icon: <CheckboxChecked /> },
    { key: 'name', header: t('in-synthetics:dashboard.testList.configureColumns.dialog.columnNameLabel') }
  ];

  const rows = orderedRowIds
    .map(id => {
      const col = columnDefinitions.find(col => col.id === id)!;
      const isChecked = !col.optional || enabledColumns.includes(id);

      return {
        id,
        cells: [
          { id: `icon-${id}`, info: { header: 'icon' }, value: 'draggable' },
          { id: `action-${id}`, info: { header: 'action' }, value: { id, optional: col.optional, isChecked } },
          { id: `name-${id}`, info: { header: 'name' }, value: col.label }
        ]
      };
    })
    .filter(Boolean)
    // for search
    .filter(row =>
      row.cells.some(
        cell =>
          cell.info.header === 'name' &&
          typeof cell.value === 'string' &&
          cell.value.toLowerCase().includes(searchQuery?.toLowerCase() ?? '')
      )
    );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = orderedRowIds.findIndex(id => id === active.id);
    const newIndex = orderedRowIds.findIndex(id => id === over.id);
    const newOrderIds = arrayMove(orderedRowIds, oldIndex, newIndex);

    setOrderedRowIds(newOrderIds);
    const columnDefinitionsSorted = newOrderIds.flatMap(id => {
      const col = columnDefinitions.find(col => col.id === id);
      return col ? [col] : [];
    });
    setColDefinitions(columnDefinitionsSorted);
  };

  const handleSave = () => {
    try {
      onSubmit({ enabledColumns, disabledColumns: disabledCols });
      trySet('disabledColumns', JSON.stringify(disabledCols));
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
  };

  return (
    // @ts-expect-error
    <TearsheetNarrow
      open
      className={locals.configureColumns}
      onClose={() => setIsOpen(false)}
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
          onClick: () => setIsOpen(false)
        }
      ]}
    >
      <DataTable rows={rows} headers={headers}>
        {({ headers, getTableProps, getHeaderProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  className={locals.searchBox}
                  defaultExpanded
                  onChange={e => setSearchQuery((e as ChangeEvent<HTMLInputElement>).target.value)}
                  placeholder={t('in-synthetics:dashboard.testList.configureColumns.dialog.searchPlaceholder')}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
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
                            setDisabledCols={setDisabledCols}
                            setEnabledColumns={setEnabledColumns}
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
