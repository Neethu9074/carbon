/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import { GenericItem } from '@instana/ai-chat';

import { useTableState, TableRow, TableHeader } from 'in-events/components/AIChat/TableComponents/useTableState';
import TableView from 'in-events/components/AIChat/TableComponents/TableView';
import { useNavigateToEvent } from 'in-events/navigation/useNavigateToEvent';

interface EventsTableProps {
  messageItem: GenericItem;
}

const EventsTable = ({ messageItem }: EventsTableProps) => {
  const rows = useMemo(() => {
    return (messageItem?.user_defined?.rows || []) as TableRow[];
  }, [messageItem]);

  const headers = useMemo(() => {
    return (messageItem?.user_defined?.headers || []) as TableHeader[];
  }, [messageItem]);

  // Find the group column if it exists
  const groupColumnKey = useMemo(() => {
    return headers.find(header => header.key === 'group')?.key || '';
  }, [headers]);

  // Extract unique group values for filter options
  const groupFilterOptions = useMemo(() => {
    if (!groupColumnKey) return [];

    const uniqueGroups = new Set<string>();
    rows.forEach(row => {
      if (row[groupColumnKey]) {
        uniqueGroups.add(row[groupColumnKey]);
      }
    });

    return Array.from(uniqueGroups).map(group => ({
      value: group,
      text: group
    }));
  }, [rows, groupColumnKey]);

  const sortedFilterOptions = groupFilterOptions.sort((a, b) => a.text.localeCompare(b.text));

  const navigateToEvent = useNavigateToEvent();

  const handleRowClick = (row: any) => {
    navigateToEvent(row?.eventId);
  };

  // Use our custom hook to manage table state
  const tableState = useTableState({
    initialRows: rows,
    initialHeaders: headers,
    filterOptions: sortedFilterOptions,
    filterColumnName: groupColumnKey || undefined,
    handleRowClick: handleRowClick
  });

  return (
    <div className="events-table-container">
      <TableView tableState={tableState} />
    </div>
  );
};

export default EventsTable;
