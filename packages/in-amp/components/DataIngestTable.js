/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card, DashboardTable, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getDataTableAsResultObservable } from 'in-amp/api/account';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import CsvExporter from 'in-components/CsvExporter';
import { t } from 'in-i18n';

import locals from './DataIngestTable.mless';

const BYTES_IN_A_GIBIBYTE = 1_073_741_824;
const DEFAULT_ENTITLEMENT_STANDARD = 348_966_092_800; // 325 GiB
const DEFAULT_ENTITLEMENT_ESSENTIALS = 53_687_091_200; // 50 GiB

/**
 * A table explaining the calculation on fair use and data ingest.
 * Retrieves the current month fair use data and displays them in multiple annotated columns.
 * @return The data ingest table.
 */
const DataIngestTable = () => {
  let header = [];
  let rows = [];
  const [searchQuery, setSearchQuery] = useState('');
  const dataTableResult = useObservable(getDataTableAsResultObservable, []);
  const dataTable = dataTableResult?.data;

  if (dataTable) {
    const sortedTimestamps = Object.keys(dataTable).sort();

    header = [
      {
        header: t('in-amp:components.dataIngestTable.row'),
        key: 'row'
      },
      {
        header: '',
        key: 'title'
      },
      {
        header: t('in-amp:components.dataIngestTable.unit'),
        key: 'unit'
      },
      {
        header: '',
        key: 'offering'
      },
      ...sortedTimestamps.map(timestamp => getDataIngestTableHeaderCell(dataTable[timestamp]?.timestamp)),
      {
        header: t('in-amp:components.dataIngestTable.calculation'),
        key: 'calculation'
      }
    ];

    rows = [
      getDataIngestTableRow(
        dataTable,
        1,
        t('in-amp:components.dataIngestTable.entitledNumberOfMVS'),
        'MVS',
        'Standard',
        getEntitledMVSStandard,
        ''
      ),
      getDataIngestTableRow(dataTable, 2, '', 'MVS', 'Essentials', getEntitledMVSEssentials, ''),
      getDataIngestTableRow(
        dataTable,
        3,
        t('in-amp:components.dataIngestTable.actualAverage'),
        'MVS',
        'Standard',
        getConfiguredMVSStandard,
        ''
      ),
      getDataIngestTableRow(dataTable, 4, '', 'MVS', 'Essentials', getConfiguredMVSEssentials, ''),
      getDataIngestTableRow(
        dataTable,
        5,
        t('in-amp:components.dataIngestTable.onDemandNumber'),
        'MVS',
        'Standard',
        getOnDemandMVSStandard,
        '(3)-(1)'
      ),
      getDataIngestTableRow(dataTable, 6, '', 'MVS', 'Essentials', getOnDemandMVSEssentials, '(4)-(2)'),
      getDataIngestTableRow(
        dataTable,
        7,
        t('in-amp:components.dataIngestTable.dataIngestFairUseEntitlement'),
        'GB',
        'Standard',
        getFairUseEntitlementStandard,
        ''
      ),
      getDataIngestTableRow(dataTable, 8, '', 'GB', 'Essentials', getFairUseEntitlementEssentials, ''),
      getDataIngestTableRow(
        dataTable,
        9,
        t('in-amp:components.dataIngestTable.totalDataIngestFairUseEntitlement'),
        'GB',
        'Standard',
        getTotalFairUseEntitlementStandard,
        '(1)x(7)'
      ),
      getDataIngestTableRow(dataTable, 10, '', 'GB', 'Essentials', getTotalFairUseEntitlementEssentials, '(2)x(8)'),
      getDataIngestTableRow(dataTable, 11, '', 'GB', 'Total', getTotalFairUseEntitlement, '(9)+(10)'),
      getDataIngestTableRow(
        dataTable,
        12,
        t('in-amp:components.dataIngestTable.dataIngestAddOnEntitlement'),
        'GB',
        '',
        getAddOnEntitlement,
        t('in-amp:components.dataIngestTable.totalAmountPurchased')
      ),
      getDataIngestTableRow(
        dataTable,
        13,
        t('in-amp:components.dataIngestTable.dataIngestEntitlementFromOnDemand'),
        'GB',
        'Total',
        getOnDemandEntitlement,
        '(5)x(7)+(6)x(8)'
      ),
      getDataIngestTableRow(
        dataTable,
        14,
        t('in-amp:components.dataIngestTable.totalDataIngestEntitlement'),
        'GB',
        'Total',
        getTotalDataIngestEntitlement,
        '(11)+(12)+(13)'
      ),
      getDataIngestTableRow(
        dataTable,
        15,
        t('in-amp:components.dataIngestTable.actualDataIngest'),
        'GB',
        'Total',
        getActualDataIngest,
        ''
      ),
      getDataIngestTableRow(
        dataTable,
        16,
        t('in-amp:components.dataIngestTable.onDemandDataIngest'),
        'GB',
        'Total',
        getOnDemandDataIngest,
        '(15)-(14)'
      )
    ].filter(item => {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  if (!dataTable) {
    // If there is no data to load, do not show the table. Perhaps to be replaced with loading animations.
    return null;
  }

  return (
    <Card>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <SubViewHeader>{t('in-amp:components.dataIngestTable.consumptionOverview')}</SubViewHeader>
        {Array.isArray(header) && header.length && Array.isArray(rows) && rows.length && (
          <CsvExporter
            data={rows}
            headers={header.map(ele => ({
              // processing the data to make it work with CSVLink
              label: ele?.header,
              key: `${ele?.key}`
            }))}
            fileName={`${t('in-amp:components.dataIngestTable.consumptionOverview')}.csv`}
          />
        )}
      </Stack>
      <div className={locals.consumptionOverview}>
        <DashboardTable
          onSearch={e => {
            setSearchQuery(e);
          }}
          size="xs"
          headers={header}
          rows={rows}
        />
      </div>
    </Card>
  );
};

export default DataIngestTable;

/**
 * Formats the given timestamp into the format "Short-Month Year", for example "Apr 2024".
 * @param {number} timestamp The timestamp to format and display.
 * @return An object which can be used to generate header cell for a table showcasing the
 * timestamp as a readable date.
 */
const getDataIngestTableHeaderCell = timestamp => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const dateLabel = date.toLocaleDateString([], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return {
    header: dateLabel,
    key: `${timestamp}`
  };
};

/**
 * A function processing data for a single row in the data ingest table.
 * @param {object} dataTable The complete content of the data ingest table, mapped timestamp to data of that month.
 * @param {number} rowNumber The number to be displayed next to the row.
 * @param {string} title The title of the row if any.
 * @param {string} title The unit of the row if any.
 * @param {string} offering The offering of the row if any. May be Standard, Essentials, or total.
 * @param {number} retrievalFunction The function to map the data for one timestamp to a value to be displayed as the main info of the row.
 * @param {string} calculation The calculation hint displayed on the right side of the table.
 * @return An object.
 */
const getDataIngestTableRow = (dataTable, rowNumber, title, unit, offering, retrievalFunction, calculation) => {
  const sortedTimestamps = Object.keys(dataTable).sort();
  let result = {
    id: `${rowNumber}`,
    row: rowNumber,
    unit: unit,
    title: title,
    offering: offering,
    calculation: calculation
  };
  sortedTimestamps.forEach(timestamp => {
    const key = timestamp || 'undefined';
    result[key] = retrievalFunction(dataTable[timestamp]);
  });
  return result;
};

// Retrieval functions for values within the data table

const getEntitledMVSStandard = data => data?.standard?.entitled ?? 0;

const getEntitledMVSEssentials = data => data?.essentials?.entitled ?? 0;

const getConfiguredMVSStandard = data => data?.standard?.configured ?? 0;

const getConfiguredMVSEssentials = data => data?.essentials?.configured ?? 0;

const getOnDemandMVSStandard = data => Math.max(0, getConfiguredMVSStandard(data) - getEntitledMVSStandard(data));

const getOnDemandMVSEssentials = data => Math.max(0, getConfiguredMVSEssentials(data) - getEntitledMVSEssentials(data));

const getFairUseEntitlementStandard = data =>
  Math.round((data?.standard?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_STANDARD) / BYTES_IN_A_GIBIBYTE);

const getFairUseEntitlementEssentials = data =>
  Math.round((data?.essentials?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_ESSENTIALS) / BYTES_IN_A_GIBIBYTE);

const getTotalFairUseEntitlementStandard = data => getEntitledMVSStandard(data) * getFairUseEntitlementStandard(data);

const getTotalFairUseEntitlementEssentials = data =>
  getEntitledMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalFairUseEntitlement = data =>
  getTotalFairUseEntitlementStandard(data) + getTotalFairUseEntitlementEssentials(data);

const getAddOnEntitlement = data => Math.round((data?.additional ?? 0) / BYTES_IN_A_GIBIBYTE);

const getOnDemandEntitlement = data =>
  getOnDemandMVSStandard(data) * getFairUseEntitlementStandard(data) +
  getOnDemandMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalDataIngestEntitlement = data =>
  getTotalFairUseEntitlement(data) + getAddOnEntitlement(data) + getOnDemandEntitlement(data);

const getActualDataIngest = data => Math.round((data?.consumed ?? 0) / BYTES_IN_A_GIBIBYTE);

const getOnDemandDataIngest = data => Math.max(0, getActualDataIngest(data) - getTotalDataIngestEntitlement(data));
