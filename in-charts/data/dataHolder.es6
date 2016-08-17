export default function createDataHolder({numberOfSeries}) {
  // A data column has the form Array<DataPoint>
  let dataColumns = [];

  return {
    insertSorted,
    getDataColumns,
    expireDataPointsOlderThan,
    clear
  };


  function getDataColumns() {
    return dataColumns;
  }


  function insertSorted(newDataColumns) {
    for (let newIndex = 0, newLength = newDataColumns.length;
         newIndex < newLength;
         newIndex++) {
      const newDataColumn = newDataColumns[newIndex];
      const newTime = newDataColumn.time;
      let columnMerged = false;

      for (let i = dataColumns.length; i > 0 && !columnMerged; i--) {
        const existingDataColumn = dataColumns[i - 1];
        const existingTime = existingDataColumn.time;

        if (newTime > existingTime) {
          dataColumns.splice(i, 0, newDataColumn);
          columnMerged = true;
        } else if (newTime === existingTime) {
          mergeColumns(existingDataColumn, newDataColumn);
          columnMerged = true;
        }
      }

      // Very interesting - the data point belongs to the start. Probably
      // the first data column ever.
      if (!columnMerged) {
        dataColumns.splice(0, 0, newDataColumn);
      }
    }
  }


  function mergeColumns(existingDataColumn, newDataColumn) {
    for (let i = 0; i < numberOfSeries; i++) {
      const newDataPoint = newDataColumn[i];
      if (newDataPoint != null) {
        existingDataColumn[i] = newDataPoint;
      }
    }
  }


  function expireDataPointsOlderThan(minTimestamp) {
    let tooOldDataPointFound = false;
    let i = 0;
    for (let len = dataColumns.length; i < len && !tooOldDataPointFound; i++) {
      tooOldDataPointFound = dataColumns[i].time < minTimestamp;
    }
    if (tooOldDataPointFound) {
      dataColumns.splice(0, i);
    }
    return tooOldDataPointFound;
  }


  function clear() {
    dataColumns = [];
  }
}
