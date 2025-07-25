/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '@instana/carbon';

import { t } from 'in-i18n';

export type LicenseRow = {
  id: string;
  name: string;
  tenant: string;
  type: string;
  start: string;
  expire: string;
  amp: string | number;
  infra: string | number;
};

type LicenseTableProps = {
  rows: LicenseRow[];
  title?: string;
  pageSize: number;
  page: number;
  totalItems: number;
  isLoading?: boolean;
  onPaginationChange: (page: number, pageSize: number) => void;
};

// Common Column Headers
const headers = [
  { key: 'name', header: t('in-amp:components.activeLicenses.name') },
  { key: 'tenant', header: t('in-amp:components.activeLicenses.tenant') },
  { key: 'type', header: t('in-amp:components.activeLicenses.type') },
  { key: 'start', header: t('in-amp:accountAndBilling.entitlementsTableColumns.startDate') },
  { key: 'expire', header: t('in-amp:accountAndBilling.entitlementsTableColumns.endDate') },
  { key: 'amp', header: t('in-amp:accountAndBilling.entitlementsTableColumns.standardHosts') },
  { key: 'infra', header: t('in-amp:accountAndBilling.entitlementsTableColumns.essentialHosts') }
];

export default function LicenseCarbonTable({
  rows,
  title,
  pageSize,
  page,
  totalItems,
  isLoading,
  onPaginationChange
}: LicenseTableProps) {
  if (isLoading) {
    return <DataTableSkeleton headers={headers} columnCount={7} showHeader />;
  }

  return (
    <TableContainer title={title}>
      <DataTable rows={rows} headers={headers} isSortable={false}>
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
              {rows.map(row => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        page={page}
        pageSizes={[20, 40, 60, 80, 100]}
        onChange={({ page, pageSize }) => onPaginationChange(page, pageSize)}
      />
    </TableContainer>
  );
}
