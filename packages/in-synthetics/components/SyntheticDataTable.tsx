/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '@instana/carbon';
import { TableSkeleton } from '@instana/components';

import { CarbonHeader, CarbonRow, ListItem } from 'in-synthetics/components/constants';
import { TableProps } from 'in-components/tables/ServerTable/types';

interface SyntheticDataTableProps<ITEM_TYPE extends ListItem, PropsType extends TableProps<ITEM_TYPE>> {
  rows: CarbonRow[];
  headers: CarbonHeader<ITEM_TYPE, PropsType>[];
  isLoading: boolean;
}

export const SyntheticDataTable = <ITEM_TYPE extends ListItem, PropsType extends TableProps<ITEM_TYPE>>({
  rows,
  headers,
  isLoading
}: SyntheticDataTableProps<ITEM_TYPE, PropsType>) => {
  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers }) => (
        <TableContainer>
          <>
            {isLoading ? (
              <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={headers.length} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader key={header?.key}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        </TableContainer>
      )}
    </DataTable>
  );
};
