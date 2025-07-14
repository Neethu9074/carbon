/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableToolbar,
  TableToolbarContent,
  TableRow,
  TableContainer
} from '@instana/carbon';
import { TableSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/carbon';

import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import useDatatIngestHeaderRows from 'in-amp/hooks/useDatatIngestHeaderRows';
import { getDataTableAsResultObservable } from 'in-amp/api/account';
import { t } from 'in-i18n';

/**
 * A table explaining the calculation on fair use and data ingest.
 * Retrieves the current month fair use data and displays them in multiple annotated columns.
 * @return The data ingest table.
 */
const DataIngestTable = () => {
  const dataTableResult = useObservable(getDataTableAsResultObservable, []);
  const dataTable = dataTableResult?.data;
  const [header, rows] = useDatatIngestHeaderRows(dataTable);

  const loading = dataTableResult?.progress?.loading;

  function getCSVData(data, header) {
    if (!data?.length || !header?.length) return '';
    const headerLabels = header.map(h => h.header);
    const headerKeys = header.map(h => h.key);
    const rows = data.map(row =>
      headerKeys.map(key => {
        const value = row[key];
        return `"${(value ?? '').toString().replace(/"/g, '""')}"`;
      })
    );
    return [headerLabels, ...rows].map(r => r.join(',')).join('\n');
  }

  function handleButtonClick(rows, header) {
    const plainRows = rows.map(r => Object.fromEntries(header.map((h, i) => [h.key, r.cells[i]?.value ?? ''])));
    const csv = getCSVData(plainRows, header);
    const a = document.body.appendChild(document.createElement('a'));
    a.download = `${t('in-amp:components.dataIngestTable.consumptionOverview')}.csv`;
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.click();
    document.body.removeChild(a);
  }

  if (loading) {
    return (
      <TableContainer title={t('in-amp:components.dataIngestTable.consumptionOverview')}>
        <TableSkeleton headers={[]} rowCount={16} columnCount={12} compact />
      </TableContainer>
    );
  }

  if (!dataTable) {
    return null;
  }

  return (
    <TableContainer title={t('in-amp:components.dataIngestTable.consumptionOverview')}>
      <DataTable rows={rows} headers={header}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getToolbarProps }) => {
          return (
            <>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  {Array.isArray(headers) && headers.length > 0 && Array.isArray(rows) && rows.length > 0 && (
                    <Button
                      kind="ghost"
                      renderIcon={() => <IconForButton icon="lib_actions_upload" iconSize="xs" />}
                      onClick={() => handleButtonClick(rows, header)}
                    >
                      {t('in-amp:components.dataIngestTable.csvExporter')}
                    </Button>
                  )}
                </TableToolbarContent>
              </TableToolbar>
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
                      {row.cells.map(cell => {
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          );
        }}
      </DataTable>
    </TableContainer>
  );
};

export default DataIngestTable;
