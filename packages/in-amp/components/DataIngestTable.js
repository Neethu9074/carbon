/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card, DashboardTable, DashboardTableCell, DashboardTableRow, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import useDatatIngestHeaderRows from 'in-amp/hooks/useDatatIngestHeaderRows';
import { getDataTableAsResultObservable } from 'in-amp/api/account';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import CsvExporter from 'in-components/CsvExporter';
import { t } from 'in-i18n';

import locals from './DataIngestTable.mless';

/**
 * A table explaining the calculation on fair use and data ingest.
 * Retrieves the current month fair use data and displays them in multiple annotated columns.
 * @return The data ingest table.
 */
const DataIngestTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dataTableResult = useObservable(getDataTableAsResultObservable, []);
  const dataTable = dataTableResult?.data;

  const [header, rows] = useDatatIngestHeaderRows(dataTable, searchQuery);

  if (!dataTable) {
    // If there is no data to load, do not show the table. Perhaps to be replaced with loading animations.
    return null;
  }

  return (
    <Card>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <SubViewHeader>{t('in-amp:components.dataIngestTable.consumptionOverview')}</SubViewHeader>
        {Array.isArray(header) && header.length && Array.isArray(rows) && rows.length ? (
          <CsvExporter
            data={rows}
            headers={header.map(ele => ({
              // processing the data to make it work with CSVLink
              label: ele?.header,
              key: `${ele?.key}`
            }))}
            fileName={`${t('in-amp:components.dataIngestTable.consumptionOverview')}.csv`}
          />
        ) : null}
      </Stack>
      <div className={locals.consumptionOverview}>
        <DashboardTable
          onSearch={e => {
            setSearchQuery(e);
          }}
          size="xs"
          headers={rows.length ? header : []}
          rows={rows.map((row, rowIndex) => ({
            id: `${rowIndex}`,
            ...(
              <DashboardTableRow key={rowIndex}>
                {header.map((heading, columnIndex) => (
                  <DashboardTableCell key={columnIndex}>{row[heading.key]}</DashboardTableCell>
                ))}
              </DashboardTableRow>
            )
          }))}
          hasNoDataTile={!rows.length}
          noDataHeader={t('in-amp:components.dataIngestTable.noData')}
        />
      </div>
    </Card>
  );
};

export default DataIngestTable;
