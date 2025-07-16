/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo } from 'react';

import { ContentSwitcher, Switch } from '@instana/carbon';
import { SimpleBarChart } from '@instana/carbon-charts';
import { GenericItem } from '@instana/ai-chat';

import { useTableState, TableRow, TableHeader } from 'in-events/components/AIChat/TableComponents/useTableState';
//@ts-expect-error
import { formatForBarChart } from 'in-events/components/AIChat/chatAPI';
import TableView from 'in-events/components/AIChat/TableComponents/TableView';
import { t } from 'in-i18n';

import locals from './TableChartSwitcher.mless';

interface TableChartSwitcherProps {
  messageItem: GenericItem;
  tableOnly?: boolean;
}

const TableChartSwitcher: React.FC<TableChartSwitcherProps> = ({ messageItem }) => {
  const rows = useMemo(() => {
    return (messageItem?.user_defined?.rows || []) as TableRow[];
  }, [messageItem]);

  const headers = useMemo(() => {
    return (messageItem?.user_defined?.headers || []) as TableHeader[];
  }, [messageItem]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const tableState = useTableState({
    initialRows: rows,
    initialHeaders: headers
  });

  // For chart view, use the filtered and sorted data from tableState
  const chart_data = useMemo(() => {
    return formatForBarChart({ headers, rows: tableState.paginatedRows });
  }, [headers, tableState.paginatedRows]);

  const handleSwitcherChange = (data: { index?: number }) => {
    if (typeof data.index === 'number') {
      setSelectedIndex(data.index);
    }
  };

  return (
    <div>
      <ContentSwitcher
        onChange={handleSwitcherChange}
        selectedIndex={selectedIndex}
        size={'sm'}
        className={locals.contentSwitcherContainer}
      >
        <Switch name="table" text={t('in-events:aichat.tableView')} />
        <Switch name="chart" text={t('in-events:aichat.chartView')} />
      </ContentSwitcher>
      {selectedIndex === 0 ? (
        <TableView tableState={tableState} />
      ) : (
        <SimpleBarChart data={chart_data?.data} options={chart_data?.options} />
      )}
    </div>
  );
};

export default TableChartSwitcher;
