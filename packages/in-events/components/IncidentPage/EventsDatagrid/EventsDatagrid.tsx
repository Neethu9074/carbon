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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Filter } from '@carbon/icons-react';

import { LoadingSkeleton, Typography } from '@instana/components';
import { NoDataEmptyState } from '@instana/ibm-products';
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
import { EVENT_KINDS } from 'in-events/components/EventsPage/EventsTable/types';
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
  eventType?: EVENT_KINDS;
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
    height = 400,
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
    enableSorting = false,
    eventType = undefined
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
        size: 50,
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

  // Create a ref to store the virtualizer instance
  const rowVirtualizerRef = useRef<ReturnType<typeof useVirtualizer<HTMLDivElement, Element>> | null>(null);

  // Custom wrapper for setExpanded that also triggers row height recalculation
  const handleSetExpanded = useCallback(
    (newExpandedState: ExpandedStateList) => {
      setExpanded(newExpandedState);
      // We need to wait for the state to be updated before recalculating
      setTimeout(() => {
        rowVirtualizerRef.current?.measure();
      }, 0);
    },
    [rowVirtualizerRef]
  );

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
    onExpandedChange: handleSetExpanded,
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
    estimateSize: index => (expanded[rows[index].id] ? 600 : 40),
    overscan: 20
  });

  // Store the virtualizer instance in our ref for access in handleSetExpanded
  rowVirtualizerRef.current = rowVirtualizer;

  // callback for when the user has reached the bottom of the table to load more data
  const fetchMoreOnBottomReached = useCallback(() => {
    const virtualRows = rowVirtualizer.getVirtualItems();
    const lastVirtualRow = rows[virtualRows[virtualRows.length - 1].index].id;
    const lastEventRow = rows[rows.length - 1].id;
    const reachingEnd = lastVirtualRow === lastEventRow;
    if (reachingEnd && canLoadMore && !loading) {
      loadMore();
    }
  }, [canLoadMore, loadMore, loading, rows, rowVirtualizer]);

  if (__DEV__) {
    // @ts-expect-error for debugging
    window.table = table;
  }

  return (
    <div
      className={locals.infiniteScrollingContainer}
      onScroll={() => fetchMoreOnBottomReached()}
      ref={tableContainerRef}
      style={{
        height: typeof height === 'string' ? height : `${height}px` //should be a fixed height
      }}
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
          eventType={eventType}
        />
      )}
      <div id="eventsTableContainer">
        <EventsAppliedFilters currentFilters={currentFilters} onFilterChange={onFilterChange} eventType={eventType} />
        {/* Sticky header */}
        <Table size="md" className={locals.table}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={locals.tableHeaderRow}>
                {showExpand && (
                  <TableExpandHeader
                    aria-label="expand row"
                    className={locals.tableHeader}
                    style={{
                      width: 40
                    }}
                  />
                )}
                {headerGroup.headers.map(header => (
                  <TableHeader
                    key={header.id}
                    isSortable={enableSorting && header.column.columnDef.enableSorting}
                    isSortHeader={sortingState.orderBy === header.column.id}
                    sortDirection={sortingState.orderDirection || 'NONE'}
                    className={locals.tableHeader}
                    style={{
                      width: header.getSize()
                    }}
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
          <TableBody
            className={locals.tableBody}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`
            }}
          >
            {rowVirtualizer.getVirtualItems().map(vrow => {
              const row = rows[vrow.index];

              if (showExpand) {
                return (
                  <TableRow
                    data-index={vrow.index}
                    key={vrow.key as number}
                    className={locals.tableRow}
                    style={{
                      height: `${vrow.size}px`,
                      transform: `translateY(${vrow.start}px)`,
                      flexDirection: 'column'
                    }}
                  >
                    <TableExpandRow
                      aria-label="row expanded"
                      className={locals.tableRow}
                      onExpand={() => {
                        const isRowExpanded = !!expanded[row.id];
                        if (isRowExpanded) {
                          const newExpansionState = { ...expanded, [row.id]: false };
                          handleSetExpanded(newExpansionState);
                          return;
                        }
                        const newExpansionState = { ...expanded, [row.id]: true };
                        handleSetExpanded(newExpansionState);
                      }}
                      isExpanded={!!expanded[row.id]}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className={locals.tableCell}
                          style={{
                            width: cell.column.getSize()
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableExpandRow>
                    {expanded?.[row.id] && (
                      <div
                        style={{
                          position: 'absolute',
                          transform: 'translate(2.5rem, 2.5rem)',
                          width: 'calc(80% - 2rem)' /* Account for potential padding/margins */,
                          left: 0,
                          right: 0
                        }}
                      >
                        <EventExpandedComponent event={row.original} />
                      </div>
                    )}
                  </TableRow>
                );
              }

              return (
                <TableRow
                  data-index={vrow.index}
                  key={vrow.key as number}
                  className={locals.tableRow}
                  style={{
                    height: `${vrow.size}px`,
                    transform: `translateY(${vrow.start}px)`
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={locals.tableCell}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
            {/* Empty Content */}
            {rows.length === 0 && !loading && (
              <div className={locals.emptyTable}>
                <NoDataEmptyState
                  title={<Typography variant="body-compact-02">{t('in-events:noDataAvailable')}</Typography>}
                  illustrationPosition="top"
                />
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EventsDatagrid;
