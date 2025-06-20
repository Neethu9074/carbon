/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import {
  Checkbox,
  Table,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  IconButton
} from '@carbon/react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedStateList,
  OnChangeFn,
  RowSelectionState
} from '@tanstack/react-table';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Filter } from '@carbon/icons-react';

import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { RawEvent } from '@instana/types';

// @ts-expect-error no typedef available
import { CombinedEventListItemContent } from 'in-events/components/legacy/EventListItem';
import useEventTableColumns, {
  EventHeaderType
} from 'in-events/components/IncidentPage/EventsDatagrid/EventsTableColumns';
import EventFiltersSidePanel from 'in-events/components/IncidentPage/EventsDatagrid/EventFiltersSidePanel';
import EventsAppliedFilters from 'in-events/components/IncidentPage/EventsDatagrid/EventsAppliedFilters';
// @ts-expect-error no typedef available
import { getEvent } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid.mless';

interface SortingState {
  orderBy?: string;
  orderDirection?: 'DESC' | 'ASC' | string;
}

interface EventsDatagridProps {
  events: RawEvent[];
  loading: boolean;
  loadMore: () => void;
  canLoadMore: boolean;
  showExpand?: boolean;
  headers?: EventHeaderType[];
  multiSelect?: boolean;
  height?: number | string;
  canMultiSelect?: (event: RawEvent) => boolean;
  multiSelectActions?: React.ReactElement;
  multiSelectState?: { [key: string]: boolean };
  multiSelectUpdater?: OnChangeFn<RowSelectionState>;
  filtersEnabled?: boolean;
  onFilterChange?: (newFilters: string) => void;
  currentFilters?: string;
  enableSorting?: boolean;
  onSortChange?: (newVal: SortingState | null) => void;
  sortableHeaders?: EventHeaderType[];
  sortingState?: SortingState;
}

interface EventExpandedComponentProps {
  event: RawEvent;
}

// We want to get the full event only if the user wants to open the expand button on a table,
// this potentially saves a lot of calls to be made for getEvent while showing more data than before.
const EventExpandedComponent: React.FC<EventExpandedComponentProps> = props => {
  const { event: rawEvent } = props;
  const { id: eventId } = rawEvent;

  const expandedEvent = useObservable(getEvent(eventId), [eventId]);

  if (!expandedEvent) {
    return <LoadingSkeleton />;
  }

  return <CombinedEventListItemContent event={expandedEvent} />;
};

const EventsDatagrid: React.FC<EventsDatagridProps> = props => {
  const {
    events,
    loading,
    canLoadMore,
    loadMore,
    showExpand = true,
    headers,
    height = 200,
    multiSelect = false,
    canMultiSelect,
    multiSelectActions,
    multiSelectState = {},
    multiSelectUpdater,
    filtersEnabled = false,
    onFilterChange,
    currentFilters = '',
    onSortChange = () => {},
    sortableHeaders = [],
    sortingState = {},
    enableSorting = false
  } = props;

  const shouldShowBatchActions = Object.keys(multiSelectState).length > 0;

  // ref needed for tracking scrolling position
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // need columns as memo and data as state to avoid rerenders
  let columns = useEventTableColumns(headers, sortableHeaders, enableSorting);

  if (multiSelect) {
    columns = [
      {
        id: 'select',
        size: 28,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            id="select-all"
            labelText={t('in-events:dataGridEventTable.selectAll')}
            hideLabel
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            id={`batch-checkbox__${row.id}`}
            labelText={t('in-events:dataGridEventTable.selectEvent')}
            hideLabel
          />
        )
      },
      ...columns
    ];
  }

  const [data, setData] = useState(events);
  const [filterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // capture expand state
  const [expanded, setExpanded] = useState<ExpandedStateList>({});

  useEffect(() => {
    setData(events);
  }, [events]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row.id || '',
    // @ts-expect-error
    onExpandedChange: setExpanded,
    state: {
      expanded,
      rowSelection: multiSelectState
    },
    enableRowSelection: row => (canMultiSelect ? canMultiSelect(row.original) : false),
    onRowSelectionChange: multiSelectUpdater
  });

  const { rows } = table.getRowModel();

  // converting rows to virtualized row for better performance
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 32,
    overscan: 10
  });

  const virtualRows: { index: number; start: number; end: number; size: number; lane?: number }[] =
    rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;

  // callback for when the user has reached the bottom of the table to load more data
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (!scrollHeight || !scrollTop || !clientHeight) return;
        if (scrollTop + clientHeight + 2 >= scrollHeight && canLoadMore && !loading) {
          loadMore();
        }
      }
    },
    [canLoadMore, loadMore, loading]
  );

  // Create a colgroup element with col elements for each column
  // Using React.useMemo to prevent unnecessary re-renders
  // Extract table.getAllColumns() to a variable for dependency array
  const allColumns = table.getAllColumns();

  const colGroup = React.useMemo(
    () => (
      <colgroup>
        {showExpand && <col style={{ width: '28px' }} />}
        {allColumns.map(column => (
          <col key={column.id} style={{ width: `${column.getSize()}px` }} />
        ))}
      </colgroup>
    ),
    [allColumns, showExpand]
  ); // Re-compute when columns or showExpand change

  if (__DEV__) {
    // @ts-expect-error for debugging
    window.table = table;
  }

  return (
    <TableContainer
      className={locals.tableContainer}
      style={{ height: typeof height === 'string' ? height : `${height}px` }}
    >
      {/* Toolbar */}
      {filtersEnabled && multiSelect && (
        <TableToolbar aria-label="table toolbar">
          {filtersEnabled && (
            <TableToolbarContent className={locals.tableToolbar}>
              <IconButton
                label={t('in-events:dataGridEventTable.openFilters')}
                kind="ghost"
                onClick={() => setIsFilterPanelOpen(!filterPanelOpen)}
              >
                <Filter />
              </IconButton>
            </TableToolbarContent>
          )}
          <TableBatchActions
            shouldShowBatchActions={shouldShowBatchActions}
            totalSelected={Object.keys(multiSelectState).length}
            onCancel={() => table.resetRowSelection()}
            onSelectAll={() => table.toggleAllRowsSelected(true)}
            totalCount={events.filter(ev => canMultiSelect && canMultiSelect(ev)).length}
          >
            {multiSelectActions}
          </TableBatchActions>
        </TableToolbar>
      )}
      {/* Filterpanel */}

      {filtersEnabled && (
        <EventFiltersSidePanel
          filterPanelOpen={filterPanelOpen}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
          currentFilters={currentFilters}
          onFilterChange={onFilterChange}
        />
      )}
      <div id="eventsTableContainer">
        <EventsAppliedFilters currentFilters={currentFilters} onFilterChange={onFilterChange} />
        {/* Sticky header */}
        <div className={locals.stickyHeader}>
          <Table size="md" className={locals.fixedTable}>
            {colGroup}
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {showExpand && <TableExpandHeader aria-label="expand row" />}
                  {headerGroup.headers.map(header => (
                    <TableHeader
                      key={header.id}
                      className={locals.tableHeader}
                      isSortable={enableSorting && header.column.columnDef.enableSorting}
                      isSortHeader={sortingState.orderBy === header.column.id}
                      sortDirection={sortingState.orderDirection || 'NONE'}
                      onClick={() => {
                        const columnId = header.column.id;
                        if (sortingState.orderBy === columnId) {
                          if (sortingState.orderDirection === 'ASC') {
                            onSortChange(null);
                          } else if (sortingState.orderDirection === 'DESC') {
                            onSortChange({
                              orderBy: sortingState.orderBy,
                              orderDirection: 'ASC'
                            });
                          }
                        } else {
                          onSortChange({
                            orderBy: columnId,
                            orderDirection: 'DESC'
                          });
                        }
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHeader>
                  ))}
                </TableRow>
              ))}
            </TableHead>
          </Table>
        </div>

        {/* Scrollable body */}
        <div
          ref={tableContainerRef}
          className={locals.tableBody}
          style={{
            height: typeof height === 'number' ? `${height - 48}px` : height
          }}
          onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        >
          <Table size="md" className={locals.fixedTable}>
            {colGroup}
            <TableBody>
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell style={{ height: `${paddingTop}px` }} colSpan={columns.length + (showExpand ? 1 : 0)} />
                </TableRow>
              )}
              {virtualRows.map(vrow => {
                const row = rows[vrow.index];

                if (showExpand) {
                  return (
                    <Fragment key={row.id}>
                      <TableExpandRow
                        aria-label="row expanded"
                        key={row.id}
                        onExpand={() => {
                          const isRowExpanded = !!expanded[row.id];
                          if (isRowExpanded) {
                            const newExpansionState = { ...expanded, [row.id]: false };
                            setExpanded(newExpansionState);
                            return;
                          }
                          const newExpansionState = { ...expanded, [row.id]: true };
                          setExpanded(newExpansionState);
                        }}
                        isExpanded={!!expanded[row.id]}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={columns.length + 1}>
                        {expanded?.[row.id] ? <EventExpandedComponent event={row.original} /> : <></>}
                      </TableExpandedRow>
                    </Fragment>
                  );
                }

                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {loading && (
                <TableRow>
                  {showExpand && (
                    <TableCell>
                      <LoadingSkeleton />
                    </TableCell>
                  )}

                  {table.getVisibleFlatColumns().map(c => (
                    <TableCell key={c.id}>
                      <LoadingSkeleton />
                    </TableCell>
                  ))}
                </TableRow>
              )}
              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell style={{ height: `${paddingBottom}px` }} colSpan={columns.length + (showExpand ? 1 : 0)} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TableContainer>
  );
};

export default EventsDatagrid;
