/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Download } from '@carbon/icons-react';
import React, { ChangeEvent } from 'react';
import { CSVLink } from 'react-csv';
import classNames from 'classnames';

import {
  DataTable,
  TableToolbar,
  TableToolbarSearch,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from '@instana/carbon';
import { Pagination } from '@instana/components';

import TableFilterPopover from 'in-events/components/AIChat/TableComponents/TableFilterPopover';
import { TableState } from 'in-events/components/AIChat/TableComponents/useTableState';
import { t } from 'in-i18n';

import locals from './TableView.mless';

interface TableViewProps {
  tableState: TableState;
}

const TableView: React.FC<TableViewProps> = ({ tableState }) => {
  const {
    tableId,
    // data
    paginatedRows,
    headers,

    //pagination
    setCurrentPage,
    setPageSize,
    pageSizes,
    currentPage,
    pageSize,
    totalItems,

    //sorting
    handleHeaderClick,
    searchTerm,
    sortDirection,
    sortKey,

    //filtering
    selectedFilters,
    handleFilterChange,
    filterColumnName,
    handleSearchChange,
    filterOptions,

    //csv
    csvData,

    //rowClick
    handleRowClick
  } = tableState;

  return (
    <div>
      <DataTable
        rows={paginatedRows}
        headers={headers}
        render={({ rows, headers, getHeaderProps, getRowProps, getCellProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarSearch
                defaultExpanded
                expanded
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement> | string) => {
                  if (typeof e === 'string') {
                    handleSearchChange(e);
                  } else {
                    handleSearchChange(e.target.value);
                  }
                }}
                placeholder={t('in-events:aichat.searchTable')}
                id={`search-${tableId}`}
              />
              {filterOptions && filterOptions.length > 0 && (
                <TableFilterPopover
                  filterOptions={filterOptions}
                  filterLabel={filterColumnName}
                  onApplyFilter={handleFilterChange}
                  onResetFilter={() => handleFilterChange([])}
                  selectedValues={selectedFilters}
                  tableId={tableId}
                />
              )}
              <CSVLink data={csvData.csvRows} headers={csvData.csvHeaders} filename="table-data.csv">
                <IconButton label={t('in-events:aichat.download')}>
                  <Download />
                </IconButton>
              </CSVLink>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      isSortable
                      isSortHeader={header.key === sortKey}
                      onClick={() => handleHeaderClick(header.key)}
                      sortDirection={sortDirection}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow
                    {...getRowProps({ row })}
                    key={row.id}
                    onClick={() => {
                      if (handleRowClick) {
                        const originalRow = paginatedRows.find(r => r.id === row.id);
                        handleRowClick(originalRow || row);
                      }
                    }}
                    className={classNames({
                      [locals.clickableRow]: handleRowClick !== undefined
                    })}
                  >
                    {row.cells.map(cell => (
                      <TableCell {...getCellProps({ cell })} key={cell.id} className={locals.cell}>
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
      {totalItems > 5 && (
        <Pagination
          id={`pagination-${tableId}`}
          pageSizes={pageSizes}
          page={currentPage}
          pageSize={pageSize}
          onChange={({ page, pageSize: newPageSize }: { page: number; pageSize: number }) => {
            if (newPageSize !== pageSize) {
              // When page size changes, reset to page 1
              setPageSize(newPageSize);
              setCurrentPage(1);
            } else {
              // Just a page change
              setCurrentPage(page);
            }
          }}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default TableView;
