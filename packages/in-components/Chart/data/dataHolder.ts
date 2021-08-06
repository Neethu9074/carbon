/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DataColumn } from 'in-components/Chart/data/types';
interface DataHolderParams {
  numberOfSeries: number;
}

export interface DataHolder {
  insertSorted: (newDataColumns: DataColumn[]) => void;
  getDataColumns: () => DataColumn[];
  expireDataPointsOlderThan: (minTimestamp: number) => void;
  clear: () => void;
}

export default function createDataHolder({ numberOfSeries }: DataHolderParams): DataHolder {
  // A data column has the form Array<DataPoint>
  let dataColumns: DataColumn[] = [];

  return {
    insertSorted,
    getDataColumns,
    expireDataPointsOlderThan,
    clear
  };

  function getDataColumns() {
    return dataColumns;
  }

  function insertSorted(newDataColumns: DataColumn[]) {
    let requiredMerging = false;

    for (let newIndex = 0, newLength = newDataColumns.length; newIndex < newLength; newIndex++) {
      const newDataColumn = newDataColumns[newIndex];
      const newTime = newDataColumn.time ?? 0;
      let dataAdded = false;

      for (let i = dataColumns.length; i > 0 && !dataAdded; i--) {
        const existingDataColumn = dataColumns[i - 1];
        const existingTime = existingDataColumn.time ?? 0;

        if (newTime > existingTime) {
          dataColumns.splice(i, 0, newDataColumn);
          dataAdded = true;
        } else if (newTime === existingTime) {
          mergeColumns(existingDataColumn, newDataColumn);
          requiredMerging = true;
          dataAdded = true;
        }
      }

      // Very interesting - the data point belongs to the start. Probably
      // the first data column ever.
      if (!dataAdded) {
        dataColumns.splice(0, 0, newDataColumn);
      }
    }

    return requiredMerging;
  }

  function mergeColumns(existingDataColumn: DataColumn, newDataColumn: DataColumn) {
    for (let i = 0; i < numberOfSeries; i++) {
      const newDataPoint = newDataColumn[i];
      if (newDataPoint != null && newDataPoint[1] !== null) {
        existingDataColumn[i] = newDataPoint;
      }
    }
  }

  function expireDataPointsOlderThan(minTimestamp: number) {
    let i = 0;
    const len = dataColumns.length;
    while (i < len) {
      if ((dataColumns[i].time ?? 0) >= minTimestamp) {
        break;
      }
      i++;
    }

    if (i > 0) {
      dataColumns.splice(0, i);
    }
  }

  function clear() {
    dataColumns = [];
  }
}
