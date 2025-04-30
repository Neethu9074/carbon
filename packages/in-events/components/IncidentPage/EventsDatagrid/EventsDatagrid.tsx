/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedStateList
} from '@tanstack/react-table';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  CarbonTable,
  CarbonTableBody,
  CarbonTableCell,
  CarbonTableExpandHeader,
  CarbonTableExpandRow,
  CarbonTableExpandedRow,
  CarbonTableHead,
  CarbonTableHeader,
  CarbonTableRow,
  LoadingSkeleton
} from '@instana/components';
import { useObservable } from '@instana/hooks';
import { RawEvent } from '@instana/types';

// @ts-expect-error no typedef available
import { CombinedEventListItemContent } from 'in-events/components/legacy/EventListItem';
import useEventTableColumns from 'in-events/components/IncidentPage/EventsDatagrid/EventsTableColumns';
// @ts-expect-error no typedef available
import { getEvent } from 'in-stores/events';

interface EventsDatagridProps {
  events: RawEvent[];
  loading: boolean;
  loadMore: () => void;
  canLoadMore: boolean;
  showExpand?: boolean;
  headers?: string[];
}

const EventsDatagrid = (props: EventsDatagridProps) => {
  const { events, loading, canLoadMore, loadMore, showExpand = true, headers } = props;

  // ref needed for tracking scrolling position
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // need columns as memo and data as state to avoid rerenders
  const columns = useEventTableColumns(headers);
  const [data, setData] = useState(events);

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
    // @ts-expect-error
    onExpandedChange: setExpanded,
    state: {
      expanded
    }
  });

  const { rows } = table.getRowModel();

  // converting rows to virtualized row for better performance
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 32,
    overscan: 10
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

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

  return (
    <div
      ref={tableContainerRef}
      style={{ height: 200, overflow: 'auto', width: '100%' }}
      onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
    >
      <CarbonTable size="md">
        <CarbonTableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <CarbonTableRow key={headerGroup.id}>
              {showExpand && <CarbonTableExpandHeader aria-label="expand row" ariaLabel="expand row" />}
              {headerGroup.headers.map(header => (
                <CarbonTableHeader key={header.id} style={{ width: header.getSize() }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </CarbonTableHeader>
              ))}
            </CarbonTableRow>
          ))}
        </CarbonTableHead>
        <CarbonTableBody>
          {paddingTop > 0 && (
            <CarbonTableRow>
              <CarbonTableCell style={{ height: `${paddingTop}px` }} colSpan={columns.length + 1} />
            </CarbonTableRow>
          )}
          {virtualRows.map(vrow => {
            const row = rows[vrow.index];

            if (showExpand) {
              return (
                <Fragment key={row.id}>
                  <CarbonTableExpandRow
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
                      <CarbonTableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </CarbonTableCell>
                    ))}
                  </CarbonTableExpandRow>
                  <CarbonTableExpandedRow colSpan={columns.length + 1}>
                    {expanded?.[row.id] ? <EventExpandedComponent event={row.original} /> : <></>}
                  </CarbonTableExpandedRow>
                </Fragment>
              );
            }

            return (
              <CarbonTableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <CarbonTableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </CarbonTableCell>
                ))}
              </CarbonTableRow>
            );
          })}
          {loading && (
            <CarbonTableRow>
              {showExpand && (
                <CarbonTableCell>
                  <LoadingSkeleton />
                </CarbonTableCell>
              )}

              {table.getVisibleFlatColumns().map(c => (
                <CarbonTableCell key={c.id}>
                  <LoadingSkeleton />
                </CarbonTableCell>
              ))}
            </CarbonTableRow>
          )}
          {paddingBottom > 0 && (
            <CarbonTableRow>
              <CarbonTableCell style={{ height: `${paddingBottom}px` }} colSpan={columns.length + 1} />
            </CarbonTableRow>
          )}
        </CarbonTableBody>
      </CarbonTable>
    </div>
  );
};

interface EventExpandedComponentProps {
  event: RawEvent;
}

// We want to get the full event only if the user wants to open the expand button on a table,
// this potentially saves a lot of calls to be made for getEvent while showing more data than before.
const EventExpandedComponent = (props: EventExpandedComponentProps) => {
  const { event: rawEvent } = props;
  const { id: eventId } = rawEvent;

  const expandedEvent = useObservable(getEvent(eventId), [eventId]);

  if (!expandedEvent) {
    return <LoadingSkeleton />;
  }

  return <CombinedEventListItemContent event={expandedEvent} />;
};

export default EventsDatagrid;
