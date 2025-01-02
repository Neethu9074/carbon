/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  CarbonModal,
  CarbonTable,
  CarbonTableHead,
  CarbonTableHeader,
  CarbonTableRow,
  CarbonTableBody
} from '@instana/components';

// @ts-expect-error needs ts migration
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './Chart.mless';

// Function to display the Table representation of the chart inside of a modal
export function ChartTableComponent({ chart, openTableView, setOpenTableView, tableCloseHandler }) {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  // The current header that is being sorted
  const [currentSortLabel, setCurrentSortLabel] = useState('label');
  const [firstRender, setFirstRender] = useState(true);
  const [triggerReRender, setTriggerRerender] = useState(false);

  // On first fender and when the table is opened we want to construct the headers and rows
  if (openTableView && firstRender) {
    // Create the rows for y1 values
    setRows(createTableRowsFromBarChart(chart, rows, 'y1'));
    const containsY2 = chart?.config?.y2?.labels && chart?.config?.y2?.metrics;
    if (containsY2) {
      // Create the rows for y2 values
      setRows(createTableRowsFromBarChart(chart, rows, 'y2'));
    }
    setHeaders(createTableHeadersFromBarChart());
    setFirstRender(false);
  }
  return (
    <CarbonModal
      modalHeading={chart?.config?.title || t('in-components:chart.charTable.tableVis')}
      open={openTableView}
      modalLabel={t('in-components:chart.charTable.tabularRep')}
      className={locals.tableModal}
      onRequestClose={() => {
        setOpenTableView(false);
        setFirstRender(true);
        // Only call tableCloseHandler if defined
        if (tableCloseHandler) {
          tableCloseHandler();
        }
      }}
      onRequestSubmit={() => {
        setOpenTableView(false);
        // Only call tableCloseHandler if defined
        if (tableCloseHandler) {
          tableCloseHandler();
        }
      }}
      primaryButtonText={t('in-components:chart.charTable.close')}
    >
      <CarbonTable size="lg" useZebraStyles={false} className={(triggerReRender && 'carbonChartTable') || ''}>
        <CarbonTableHead>
          <CarbonTableRow>
            {headers?.map(header => (
              <CarbonTableHeader
                isSortable
                id={header.key}
                key={header.header}
                sortDirection={header.sortDirection}
                isSortHeader={currentSortLabel == header.key && header.sortDirection != 'NONE'}
                onClick={() => {
                  const key = header.key;
                  setCurrentSortLabel(key);
                  const nextDirection = getNextSortDirection(
                    currentSortLabel,
                    key,
                    header.sortDirection,
                    setCurrentSortLabel
                  );
                  setRows(sortRow(key, rows, nextDirection));
                  setTriggerRerender(!triggerReRender);
                  header.sortDirection = nextDirection;
                }}
              >
                {header.header}
              </CarbonTableHeader>
            ))}
          </CarbonTableRow>
        </CarbonTableHead>
        <CarbonTableBody>
          {rows?.map(row => {
            return (
              <CarbonTableRow key={`${row.label}-${row.time}`}>
                {Object.keys(row)
                  .filter(key => key !== 'id')
                  ?.map(key => {
                    if (!key.includes('Raw')) {
                      return <td key={key}>{row[key]}</td>;
                    }
                  })}
              </CarbonTableRow>
            );
          })}
        </CarbonTableBody>
      </CarbonTable>
    </CarbonModal>
  );
}

// Define the table header values
export function createTableHeadersFromBarChart() {
  const headers = [
    { header: t('in-components:chart.charTable.group'), key: 'label', sortDirection: 'NONE' },
    { header: t('in-components:chart.charTable.xVal'), key: 'time', sortDirection: 'NONE' },
    { header: t('in-components:chart.charTable.yVal'), key: 'value', sortDirection: 'NONE' }
  ];
  return headers;
}

// Given the labels construct rows paired with the proper date and value
// The formatter is passed in to also correctly format the value
export function createTableRowsFromBarChart(chart, currentRows, yVal) {
  const labels = chart?.config?.[yVal]?.labels || [];
  const metrics = chart?.config?.[yVal]?.metrics || [];
  const formatter = chart?.config?.[yVal]?.formatter || [];
  const filteredDataSeries = chart?.config?.filteredDataSeries || [];
  // Identify which index values we want to not include because they are being filtered
  // out from the user
  const indexToIgnoreList = indexToIgnore(filteredDataSeries, yVal);
  const rows = currentRows;
  labels?.map((label, index) => {
    // If this index is not found we want to include it in the table
    const includeInTable = !indexToIgnoreList.includes(index.toString());
    if (includeInTable) {
      metrics[index]?.map(metric => {
        const rawTime = metric[0];
        const date = formatDateWithActiveLanguage(new Date(rawTime), `${dateFormat}, ${timeFormat}`);
        const rawVal = metric[1];
        const detailedValue = formatter[index]?.detailed(rawVal) || rawVal;
        // Raw values are used for the best pure sorting
        rows.push({
          label: label,
          labelRaw: label,
          time: date,
          timeRaw: rawTime,
          value: detailedValue,
          valueRaw: rawVal
        });
      });
    }
  });
  return rows;
}

// Sort the rows and then trigger a rerender
export function sortRow(key, rows, sortDirection) {
  const rowsCopy = [...rows];
  rowsCopy.sort((a, b) => {
    // The Raw key value is what we want to sort on
    const sortKey = `${key}Raw`;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortDirection == 'ASC') {
      if (aVal < bVal) {
        return -1;
      }
      if (aVal > bVal) {
        return 1;
      }
    } else if (sortDirection == 'DESC') {
      if (aVal > bVal) {
        return -1;
      }
      if (aVal < bVal) {
        return 1;
      }
    }
    return 0;
  });
  return rowsCopy;
}

// Log to determine the next sort direction
export function getNextSortDirection(currentSortLabel, thisSortLabel, headerDirection) {
  if (currentSortLabel == thisSortLabel) {
    if (headerDirection == 'ASC') {
      return 'DESC';
    } else if (headerDirection == 'DESC') {
      return 'ASC';
    } else if (headerDirection == 'NONE') {
      return 'ASC';
    } else {
      return 'NONE';
    }
  }
  return 'ASC';
}

// Charts contain a filterDataSeries list that contains all the labels
// the user is attempting to filter OUT from the chart.
// We want to identify which index values they are filtering out so we can remove them
// from our table
export function indexToIgnore(filteredDataSeries, yVal) {
  var ignoreIndex = [];
  for (const value of filteredDataSeries) {
    if (value.includes(yVal)) {
      const index = value.split('-')[1];
      ignoreIndex.push(index);
    }
  }
  return ignoreIndex;
}
