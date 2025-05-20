/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo } from 'react';

import { ContentSwitcher, Switch } from '@instana/carbon';
import { SimpleBarChart } from '@instana/carbon-charts';

import { formatForBarChart } from 'in-events/components/AIChat/chatAPI';
import TableView from 'in-events/components/AIChat/TableView';
import { t } from 'in-i18n';

const TableChartSwitcher = ({ messageItem }) => {
  const rows = useMemo(() => {
    return messageItem?.user_defined?.rows || [];
  }, [messageItem]);
  const headers = messageItem?.user_defined?.headers || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSizes = Array.from({ length: Math.ceil(rows.length / 5) }, (_, i) => (i + 1) * 5);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [sortKey, setSortKey] = useState(headers?.[1]?.key);
  const [sortDirection, setSortDirection] = useState('DESC');

  function customSort(a, b) {
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const lhs = a[sortKey];
    const rhs = b[sortKey];
    if (sortDirection === 'ASC') {
      return collator.compare(lhs, rhs);
    } else if (sortDirection === 'DESC') {
      return collator.compare(rhs, lhs);
    } else {
      return 0;
    }
  }

  function handleSearchChange(searchTerm) {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  function handleHeaderClick(key) {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortKey(key);
      setSortDirection('DESC');
    }
    setCurrentPage(1);
  }

  const filteredRows = useMemo(() => {
    if (!searchTerm) {
      return rows;
    }
    return rows.filter(row => {
      return Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [searchTerm, rows]);

  const sortedFilteredRows = [...filteredRows].sort(customSort);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedFilteredRows.slice(startIndex, endIndex);
  }, [sortedFilteredRows, currentPage, pageSize]);

  const chart_data = formatForBarChart({ headers: headers, rows: paginatedRows });

  return (
    <div>
      <ContentSwitcher onChange={({ index }) => setSelectedIndex(index)} selectedIndex={selectedIndex} size={'sm'}>
        <Switch name="table" text={t('in-events:aichat.tableView')} />
        <Switch name="chart" text={t('in-events:aichat.chartView')} />
      </ContentSwitcher>
      {selectedIndex === 0 ? (
        <TableView
          paginatedRows={paginatedRows}
          headers={headers}
          handleSearchChange={handleSearchChange}
          handlePageChange={setCurrentPage}
          handlePageSizeChange={setPageSize}
          pageSizes={pageSizes}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredRows.length}
          handleHeaderClick={handleHeaderClick}
          csvData={{
            //formatting for CSVLink component
            csvHeaders: headers.map(header => ({ label: header.header, key: header.key })),
            csvRows: filteredRows
          }}
          searchTerm={searchTerm}
          sortDirection={sortDirection}
          sortKey={sortKey}
        />
      ) : (
        <SimpleBarChart data={chart_data?.data} options={chart_data?.options} />
      )}
    </div>
  );
};

export default TableChartSwitcher;
