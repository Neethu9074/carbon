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
  const resultData = dataTableResult?.data;

  if (!resultData) {
    // If there is no data to load, do not show the table. Perhaps to be replaced with loading animations.
    return null;
  }

  // The table is supposed to show the current month, so take the most recent timestamp from the set.
  const latestTimestamp = Math.max(...Object.keys(resultData).map(Number));
  const data = resultData[latestTimestamp];

  const date = data?.timestamp ? new Date(data.timestamp) : new Date();
  const dateLabel = date.toLocaleDateString([], { month: 'short', year: 'numeric', timeZone: 'UTC' });

  const entitledMVSStandard = data?.standard?.entitled ?? 0;
  const entitledMVSEssentials = data?.essentials?.entitled ?? 0;
  const configuredMVSStandard = data?.standard?.configured ?? 0;
  const configuredMVSEssentials = data?.essentials?.configured ?? 0;
  const onDemandMVSStandard = Math.max(0, configuredMVSStandard - entitledMVSStandard);
  const onDemandMVSEssentials = Math.max(0, configuredMVSEssentials - entitledMVSEssentials);
  const fairUseEntitlementStandard = Math.round(
    (data?.standard?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_STANDARD) / BYTES_IN_A_GIGABYTE
  );
  const fairUseEntitlementEssentials = Math.round(
    (data?.essentials?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_ESSENTIALS) / BYTES_IN_A_GIGABYTE
  );
  const totalFairUseEntitlementStandard = entitledMVSStandard * fairUseEntitlementStandard;
  const totalFairUseEntitlementEssentials = entitledMVSEssentials * fairUseEntitlementEssentials;
  const totalFairUseEntitlement = totalFairUseEntitlementStandard + totalFairUseEntitlementEssentials;
  const addOnEntitlement = Math.round((data?.additional ?? 0) / BYTES_IN_A_GIGABYTE);
  const onDemandEntitlement =
    onDemandMVSStandard * fairUseEntitlementStandard + onDemandMVSEssentials * fairUseEntitlementEssentials;
  const totalDataIngestEntitlement = totalFairUseEntitlement + addOnEntitlement + onDemandEntitlement;
  const actualDataIngest = Math.round((data?.consumed ?? 0) / BYTES_IN_A_GIGABYTE);
  const onDemandDataIngest = Math.max(0, actualDataIngest - totalDataIngestEntitlement);

  return (
    <Table>
      <Thead>
        <Tr size="minimal">
          <Th>{t('in-amp:components.dataIngestTable.row')}</Th>
          <Th />
          <Th>{t('in-amp:components.dataIngestTable.unit')}</Th>
          <Th />
          <Th>{dateLabel}</Th>
          <Th>{t('in-amp:components.dataIngestTable.calculation')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <DataIngestTableRow
          rowNumber={1}
          title={t('in-amp:components.dataIngestTable.entitledNumberOfMVS')}
          unit="MVS"
          offering="Standard"
          value={entitledMVSStandard}
          calculation=""
        />
        <DataIngestTableRow
          rowNumber={2}
          unit="MVS"
          offering="Essentials"
          value={entitledMVSEssentials}
          calculation=""
        />
        <DataIngestTableRow
          rowNumber={3}
          title={t('in-amp:components.dataIngestTable.actualAverage')}
          unit="MVS"
          offering="Standard"
          value={configuredMVSStandard}
          calculation=""
        />
        <DataIngestTableRow
          rowNumber={4}
          unit="MVS"
          offering="Essentials"
          value={configuredMVSEssentials}
          calculation=""
        />
        <DataIngestTableRow
          rowNumber={5}
          title={t('in-amp:components.dataIngestTable.onDemandNumber')}
          unit="MVS"
          offering="Standard"
          value={onDemandMVSStandard}
          calculation={`(3)-(1), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyMVS')}`}
        />
        <DataIngestTableRow
          rowNumber={6}
          unit="MVS"
          offering="Essentials"
          value={onDemandMVSEssentials}
          calculation={`(4)-(2), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyMVS')}`}
        />
        <DataIngestTableRow
          rowNumber={7}
          title={t('in-amp:components.dataIngestTable.dataIngestFairUseEntitlement')}
          unit="GB"
          offering="Standard"
          value={fairUseEntitlementStandard}
        />
        <DataIngestTableRow rowNumber={8} unit="GB" offering="Essentials" value={fairUseEntitlementEssentials} />
        <DataIngestTableRow
          rowNumber={9}
          title={t('in-amp:components.dataIngestTable.totalDataIngestFairUseEntitlement')}
          unit="GB"
          offering="Standard"
          value={totalFairUseEntitlementStandard}
          calculation="(1)x(7)"
        />
        <DataIngestTableRow
          rowNumber={10}
          unit="GB"
          offering="Essentials"
          value={totalFairUseEntitlementEssentials}
          calculation="(2)x(8)"
        />
        <DataIngestTableRow
          rowNumber={11}
          unit="GB"
          offering="Total"
          value={totalFairUseEntitlement}
          calculation="(9)+(10)"
        />
        <DataIngestTableRow
          rowNumber={12}
          title={t('in-amp:components.dataIngestTable.dataIngestAddOnEntitlement')}
          unit="GB"
          value={addOnEntitlement}
          calculation={t('in-amp:components.dataIngestTable.totalAmountPurchased')}
        />
        <DataIngestTableRow
          rowNumber={13}
          title={t('in-amp:components.dataIngestTable.dataIngestEntitlementFromOnDemand')}
          unit="GB"
          offering="Total"
          value={onDemandEntitlement}
          calculation="(5)*(7)+(6)*(8)"
        />
        <DataIngestTableRow
          rowNumber={14}
          title={t('in-amp:components.dataIngestTable.totalDataIngestEntitlement')}
          unit="GB"
          offering="Total"
          value={totalDataIngestEntitlement}
          calculation="(11)+(12)+(13)"
        />
        <DataIngestTableRow
          rowNumber={15}
          title={t('in-amp:components.dataIngestTable.actualDataIngest')}
          unit="GB"
          offering="Total"
          value={actualDataIngest}
        />
        <DataIngestTableRow
          rowNumber={16}
          title={t('in-amp:components.dataIngestTable.onDemandDataIngest')}
          unit="GB"
          offering="Total"
          value={onDemandDataIngest}
          calculation={`(15)-(14), ${t('in-amp:components.dataIngestTable.willBeBilledMonthlyIngest')}`}
        />
      </Tbody>
    </Table>
  );
};

export default DataIngestTable;

/**
 * A component housing a single row in the data ingest table.
 * @param {number} rowNumber The number to be displayed next to the row.
 * @param {string} title The title of the row if any.
 * @param {string} title The unit of the row if any.
 * @param {string} offering The offering of the row if any. May be Standard, Essentials, or total.
 * @param {number} value The value to be displayed as the main info of the row.
 * @param {string} calculation The calculation hint displayed on the right side of the table.
 * @return A row in the data ingest table.
 */
const DataIngestTableRow = ({ rowNumber, title, unit, offering, value, calculation }) => {
  return (
    <Tr size="minimal">
      <Td className={locals.rightAlign}>{rowNumber}</Td>
      <Td>{title}</Td>
      <Td>{unit}</Td>
      <Td>{offering}</Td>
      <Td className={locals.rightAlign}>{value}</Td>
      <Td>{calculation}</Td>
    </Tr>
  );
};
