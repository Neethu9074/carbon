/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Download } from '@carbon/icons-react';
import { CSVLink } from 'react-csv';
import React from 'react';

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

import { t } from 'in-i18n';

const TableView = ({
  paginatedRows,
  headers,
  handleSearchChange,
  handlePageChange,
  handlePageSizeChange,
  pageSizes,
  currentPage,
  pageSize,
  totalItems,
  handleHeaderClick,
  csvData,
  searchTerm,
  sortDirection,
  sortKey
}) => {
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
                onChange={e => handleSearchChange(e.target.value)}
                placeholder={t('in-events:aichat.searchTable')}
              />
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
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map(cell => (
                      <TableCell {...getCellProps({ cell })} key={cell.id}>
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
      <Pagination
        pageSizes={pageSizes}
        page={currentPage}
        pageSize={pageSize}
        onChange={({ page, pageSize }) => {
          handlePageChange(page);
          handlePageSizeChange(pageSize);
        }}
        totalItems={totalItems}
      />
    </div>
  );
};

export default TableView;
