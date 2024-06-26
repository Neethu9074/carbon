/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Table, Thead, Tr, Th, Tbody, Td } from '@instana/legacy';
import { useObservable } from '@instana/hooks';

import { getDataTableAsResultObservable } from 'in-amp/api/account';
import { t } from 'in-i18n';

import locals from './DataIngestTable.mless';

const BYTES_IN_A_GIGABYTE = 1_000_000_000;
const DEFAULT_ENTITLEMENT_STANDARD = 350_000_000_000;
const DEFAULT_ENTITLEMENT_ESSENTIALS = 50_000_000_000;

/**
 * A table explaining the calculation on fair use and data ingest.
 * Retrieves the current month fair use data and displays them in multiple annotated columns.
 * @return The data ingest table.
 */
const DataIngestTable = () => {
  const dataTableResult = useObservable(getDataTableAsResultObservable, []);
  const dataTable = dataTableResult?.data;

  if (!dataTable) {
    // If there is no data to load, do not show the table. Perhaps to be replaced with loading animations.
    return null;
  }

  const sortedTimestamps = Object.keys(dataTable).sort();

  return (
    <Table>
      <Thead>
        <Tr size="minimal">
          <Th>{t('in-amp:components.dataIngestTable.row')}</Th>
          <Th />
          <Th>{t('in-amp:components.dataIngestTable.unit')}</Th>
          <Th />
          {sortedTimestamps.map(timestamp => (
            <DataIngestTableHeaderCell key={timestamp} timestamp={dataTable[timestamp]?.timestamp} />
          ))}
          <Th>{t('in-amp:components.dataIngestTable.calculation')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={1}
          title={t('in-amp:components.dataIngestTable.entitledNumberOfMVS')}
          unit="MVS"
          offering="Standard"
          retrievalFunction={getEntitledMVSStandard}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={2}
          unit="MVS"
          offering="Essentials"
          retrievalFunction={getEntitledMVSEssentials}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={3}
          title={t('in-amp:components.dataIngestTable.actualAverage')}
          unit="MVS"
          offering="Standard"
          retrievalFunction={getConfiguredMVSStandard}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={4}
          unit="MVS"
          offering="Essentials"
          retrievalFunction={getConfiguredMVSEssentials}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={5}
          title={t('in-amp:components.dataIngestTable.onDemandNumber')}
          unit="MVS"
          offering="Standard"
          retrievalFunction={getOnDemandMVSStandard}
          calculation={`(3)-(1), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyMVS')}`}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={6}
          unit="MVS"
          offering="Essentials"
          retrievalFunction={getOnDemandMVSEssentials}
          calculation={`(4)-(2), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyMVS')}`}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={7}
          title={t('in-amp:components.dataIngestTable.dataIngestFairUseEntitlement')}
          unit="GB"
          offering="Standard"
          retrievalFunction={getFairUseEntitlementStandard}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={8}
          unit="GB"
          offering="Essentials"
          retrievalFunction={getFairUseEntitlementEssentials}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={9}
          title={t('in-amp:components.dataIngestTable.totalDataIngestFairUseEntitlement')}
          unit="GB"
          offering="Standard"
          retrievalFunction={getTotalFairUseEntitlementStandard}
          calculation="(1)x(7)"
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={10}
          unit="GB"
          offering="Essentials"
          retrievalFunction={getTotalFairUseEntitlementEssentials}
          calculation="(2)x(8)"
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={11}
          unit="GB"
          offering="Total"
          retrievalFunction={getTotalFairUseEntitlement}
          calculation="(9)+(10)"
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={12}
          title={t('in-amp:components.dataIngestTable.dataIngestAddOnEntitlement')}
          unit="GB"
          retrievalFunction={getAddOnEntitlement}
          calculation={t('in-amp:components.dataIngestTable.totalAmountPurchased')}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={13}
          title={t('in-amp:components.dataIngestTable.dataIngestEntitlementFromOnDemand')}
          unit="GB"
          offering="Total"
          retrievalFunction={getOnDemandEntitlement}
          calculation="(5)x(7)+(6)x(8)"
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={14}
          title={t('in-amp:components.dataIngestTable.totalDataIngestEntitlement')}
          unit="GB"
          offering="Total"
          retrievalFunction={getTotalDataIngestEntitlement}
          calculation="(11)+(12)+(13)"
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={15}
          title={t('in-amp:components.dataIngestTable.actualDataIngest')}
          unit="GB"
          offering="Total"
          retrievalFunction={getActualDataIngest}
        />
        <DataIngestTableRow
          dataTable={dataTable}
          rowNumber={16}
          title={t('in-amp:components.dataIngestTable.onDemandDataIngest')}
          unit="GB"
          offering="Total"
          retrievalFunction={getOnDemandDataIngest}
          calculation={`(15)-(14), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyIngest')}`}
        />
      </Tbody>
    </Table>
  );
};

export default DataIngestTable;

/**
 * Formats the given timestamp into the format "Short-Month Year", for example "Apr 2024".
 * @param {number} timestamp The timestamp to format and display.
 * @return A header cell for a table showcasing the timestamp as a readable date.
 */
const DataIngestTableHeaderCell = ({ timestamp }) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const dateLabel = date.toLocaleDateString([], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return <Th>{dateLabel}</Th>;
};

/**
 * A component housing a single row in the data ingest table.
 * @param {object} dataTable The complete content of the data ingest table, mapped timestamp to data of that month.
 * @param {number} rowNumber The number to be displayed next to the row.
 * @param {string} title The title of the row if any.
 * @param {string} title The unit of the row if any.
 * @param {string} offering The offering of the row if any. May be Standard, Essentials, or total.
 * @param {number} retrievalFunction The function to map the data for one timestamp to a value to be displayed as the main info of the row.
 * @param {string} calculation The calculation hint displayed on the right side of the table.
 * @return A row in the data ingest table.
 */
const DataIngestTableRow = ({ dataTable, rowNumber, title, unit, offering, retrievalFunction, calculation }) => {
  const sortedTimestamps = Object.keys(dataTable).sort();

  return (
    <Tr size="minimal">
      <Td className={locals.rightAlign}>{rowNumber}</Td>
      <Td>{title}</Td>
      <Td>{unit}</Td>
      <Td>{offering}</Td>
      {sortedTimestamps.map(timestamp => (
        <Td className={locals.rightAlign}>{retrievalFunction(dataTable[timestamp])}</Td>
      ))}
      <Td>{calculation}</Td>
    </Tr>
  );
};

// Retrieval functions for values within the data table

const getEntitledMVSStandard = data => data?.standard?.entitled ?? 0;

const getEntitledMVSEssentials = data => data?.essentials?.entitled ?? 0;

const getConfiguredMVSStandard = data => data?.standard?.configured ?? 0;

const getConfiguredMVSEssentials = data => data?.essentials?.configured ?? 0;

const getOnDemandMVSStandard = data => Math.max(0, getConfiguredMVSStandard(data) - getEntitledMVSStandard(data));

const getOnDemandMVSEssentials = data => Math.max(0, getConfiguredMVSEssentials(data) - getEntitledMVSEssentials(data));

const getFairUseEntitlementStandard = data =>
  Math.round((data?.standard?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_STANDARD) / BYTES_IN_A_GIGABYTE);

const getFairUseEntitlementEssentials = data =>
  Math.round((data?.essentials?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_ESSENTIALS) / BYTES_IN_A_GIGABYTE);

const getTotalFairUseEntitlementStandard = data => getEntitledMVSStandard(data) * getFairUseEntitlementStandard(data);

const getTotalFairUseEntitlementEssentials = data =>
  getEntitledMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalFairUseEntitlement = data =>
  getTotalFairUseEntitlementStandard(data) + getTotalFairUseEntitlementEssentials(data);

const getAddOnEntitlement = data => Math.round((data?.additional ?? 0) / BYTES_IN_A_GIGABYTE);

const getOnDemandEntitlement = data =>
  getOnDemandMVSStandard(data) * getFairUseEntitlementStandard(data) +
  getOnDemandMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalDataIngestEntitlement = data =>
  getTotalFairUseEntitlement(data) + getAddOnEntitlement(data) + getOnDemandEntitlement(data);

const getActualDataIngest = data => Math.round((data?.consumed ?? 0) / BYTES_IN_A_GIGABYTE);

const getOnDemandDataIngest = data => Math.max(0, getActualDataIngest(data) - getTotalDataIngestEntitlement(data));
