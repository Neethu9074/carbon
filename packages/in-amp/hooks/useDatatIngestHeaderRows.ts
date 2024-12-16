/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { t } from 'in-i18n';

const BYTES_IN_A_GIBIBYTE = 1_073_741_824;
const DEFAULT_ENTITLEMENT_STANDARD = 348_966_092_800; // 325 GiB
const DEFAULT_ENTITLEMENT_ESSENTIALS = 53_687_091_200; // 50 GiB

interface HeaderProp {
  header: string;
  key: string;
}

interface RowProp {
  calculation: string;
  id: string;
  offering: string;
  row: number;
  title: string;
  unit: string;
  [timestamp: string]: any;
}

interface DataTableValueProp {
  standard: {
    entitled: number;
    configured: number;
    budgetPerUnit: number;
  };
  essentials: {
    entitled: number;
    configured: number;
    budgetPerUnit: number;
  };
  additional: number;
  consumed: number;
  timestamp: number;
}

interface DataTableProp {
  [key: string]: DataTableValueProp;
}

export default function useDatatIngestHeaderRows(dataTable: DataTableProp, searchQuery: string) {
  return useMemo(() => {
    let header: HeaderProp[] = [];
    let rows: RowProp[] = [];
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
        getDataIngestTableRow(dataTable, 6, '', 'MVS', 'Essentials', getOnDemandMVSEssentials, '(4)-(2) - ((1)-(3))'),
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
    return [header, rows];
  }, [dataTable, searchQuery]);
}

/**
 * Formats the given timestamp into the format "Short-Month Year", for example "Apr 2024".
 * @param timestamp The timestamp to format and display.
 * @return An object which can be used to generate header cell for a table showcasing the
 * timestamp as a readable date.
 */
export const getDataIngestTableHeaderCell = (timestamp: number) => {
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
 * @param dataTable The complete content of the data ingest table, mapped timestamp to data of that month.
 * @param rowNumber The number to be displayed next to the row.
 * @param title The title of the row if any.
 * @param title The unit of the row if any.
 * @param offering The offering of the row if any. May be Standard, Essentials, or total.
 * @param retrievalFunction The function to map the data for one timestamp to a value to be displayed as the main info of the row.
 * @param calculation The calculation hint displayed on the right side of the table.
 * @return An object with values needed to render the table row.
 */
const getDataIngestTableRow = (
  dataTable: DataTableProp,
  rowNumber: number,
  title: string,
  unit: string,
  offering: string,
  retrievalFunction: (param: DataTableValueProp) => void,
  calculation: string
) => {
  const sortedTimestamps = Object.keys(dataTable).sort();
  let result: RowProp = {
    id: `${rowNumber}`,
    row: rowNumber,
    unit: unit,
    title: title,
    offering: offering,
    calculation: calculation
  };
  sortedTimestamps.forEach(timestamp => {
    result[timestamp] = retrievalFunction(dataTable[timestamp]);
  });
  return result;
};

// Retrieval functions for values within the data table

const getEntitledMVSStandard = (data: DataTableValueProp) => data?.standard?.entitled ?? 0;

const getEntitledMVSEssentials = (data: DataTableValueProp) => data?.essentials?.entitled ?? 0;

const getConfiguredMVSStandard = (data: DataTableValueProp) => data?.standard?.configured ?? 0;

const getConfiguredMVSEssentials = (data: DataTableValueProp) => data?.essentials?.configured ?? 0;

const getOnDemandMVSStandard = (data: DataTableValueProp) =>
  Math.max(0, getConfiguredMVSStandard(data) - getEntitledMVSStandard(data));

const getOnDemandMVSEssentials = (data: DataTableValueProp) =>
  Math.max(
    0,
    getConfiguredMVSEssentials(data) -
      getEntitledMVSEssentials(data) -
      Math.max(0, getEntitledMVSStandard(data) - getConfiguredMVSStandard(data))
  );

const getFairUseEntitlementStandard = (data: DataTableValueProp) =>
  Math.round((data?.standard?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_STANDARD) / BYTES_IN_A_GIBIBYTE);

const getFairUseEntitlementEssentials = (data: DataTableValueProp) =>
  Math.round((data?.essentials?.budgetPerUnit ?? DEFAULT_ENTITLEMENT_ESSENTIALS) / BYTES_IN_A_GIBIBYTE);

const getTotalFairUseEntitlementStandard = (data: DataTableValueProp) =>
  getEntitledMVSStandard(data) * getFairUseEntitlementStandard(data);

const getTotalFairUseEntitlementEssentials = (data: DataTableValueProp) =>
  getEntitledMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalFairUseEntitlement = (data: DataTableValueProp) =>
  getTotalFairUseEntitlementStandard(data) + getTotalFairUseEntitlementEssentials(data);

const getAddOnEntitlement = (data: DataTableValueProp) => Math.round((data?.additional ?? 0) / BYTES_IN_A_GIBIBYTE);

const getOnDemandEntitlement = (data: DataTableValueProp) =>
  getOnDemandMVSStandard(data) * getFairUseEntitlementStandard(data) +
  getOnDemandMVSEssentials(data) * getFairUseEntitlementEssentials(data);

const getTotalDataIngestEntitlement = (data: DataTableValueProp) =>
  getTotalFairUseEntitlement(data) + getAddOnEntitlement(data) + getOnDemandEntitlement(data);

const getActualDataIngest = (data: DataTableValueProp) => Math.round((data?.consumed ?? 0) / BYTES_IN_A_GIBIBYTE);

const getOnDemandDataIngest = (data: DataTableValueProp) =>
  Math.max(0, getActualDataIngest(data) - getTotalDataIngestEntitlement(data));
