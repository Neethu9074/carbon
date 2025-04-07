/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonDataTable as DataTable,
  CarbonTable as Table,
  CarbonTableHead as TableHead,
  CarbonTableRow as TableRow,
  CarbonTableHeader as TableHeader,
  CarbonTableBody as TableBody,
  CarbonTableCell as TableCell,
  Pagination as CarbonPagination,
  CarbonEmptyState as EmptyState
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/details/components/DNSTestDetails.mless';

interface DNSRecordTableProps {
  records: Record<string, string>[];
}

export const DNSRecordTable = ({ records }: DNSRecordTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const rows = records.map(record => {
    return {
      ...record,
      id: generateUniqueShortId()
    };
  });

  const pagedRows = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return rows?.slice(startIndex, endIndex);
  };

  const headers = [
    {
      key: 'name',
      header: t('in-synthetics:dashboard.detailsPage.dns.name')
    },
    {
      key: 'ttl',
      header: t('in-synthetics:dashboard.detailsPage.dns.ttl')
    },
    {
      key: 'data',
      header: t('in-synthetics:dashboard.detailsPage.dns.data')
    }
  ];
  const updatePageState = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <DataTable rows={pagedRows()} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length > 0 ? (
                rows.map(row => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length}>
                    <EmptyState
                      className={locals.emptyState}
                      icon="lib_carbon_empty_state"
                      title={t('in-synthetics:dashboard.detailsPage.dns.noRecordsFound')}
                      text=""
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DataTable>
      {records.length > 5 && (
        <CarbonPagination
          totalItems={records.length}
          pageSize={pageSize}
          pageSizes={[5, 10, 15]}
          page={page}
          onChange={updatePageState}
        />
      )}
    </>
  );
};
