/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DataColumn } from 'in-components/Chart/data/types';

/**
 * requireExistenceInAllSeries indicates whether for a time X, data points have
 * to exist in all data series in order for the value to be returned.
 *
 * Generally, requireExistenceInAllSeries=true is required for stacked area
 * charts and stacked bar charts. Line charts and scatter plots can generally
 * work with requireExistenceInAllSeries=false (the default).
 */

interface CreateQueueProps {
  numberOfSeries: number;
  requireExistenceInAllSeries: boolean;
}

export interface Queue {
  addDataPoints: (seriesIndex: number, dataPoints: [number, number][]) => void;
  addDataPoint: (seriesIndex: number, dataPoints: [number, number]) => void;
  clear: () => void;
  get: () => DataColumn[];
}

export default function createQueue({ numberOfSeries, requireExistenceInAllSeries = false }: CreateQueueProps): Queue {
  // [
  //   // data series 1
  //   {
  //     <time>: [time, value]
  //   }
  // ]
  const series: Record<number, number[]>[] = [];

  clear();

  return {
    addDataPoints,
    addDataPoint,
    clear,
    get: requireExistenceInAllSeries ? getStrict : getLoose
  };

  function addDataPoints(seriesIndex: number, dataPoints: number[][]) {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      const dataPoint = dataPoints[i];

      // data points are not guaranteed to be filled
      if (dataPoint) {
        series[seriesIndex][dataPoint[0]] = dataPoint;
      }
    }
  }

  function addDataPoint(seriesIndex: number, dataPoint: number[]) {
    series[seriesIndex][dataPoint[0]] = dataPoint;
  }

  function getStrict() {
    const dataColumns = [];
    const firstSeries = series[0];

    for (const time in firstSeries) {
      if (!Object.prototype.hasOwnProperty.call(firstSeries, time)) {
        continue;
      }

      if (!isDataPointInEverySeries(time)) {
        continue;
      }

      const column: DataColumn = [];
      for (let i = 0; i < numberOfSeries; i++) {
        column[i] = series[i][time];
      }
      column.time = column[0][0];
      dataColumns.push(column);
    }

    // The logic above does not guarantee data column ordering. The array
    // will mostly be order or almost ordered.
    dataColumns.sort(dataColumnSorter);

    // Time to remove all data points which we have successfully processed.
    for (let i = 0, len = dataColumns.length; i < len; i++) {
      const time = dataColumns[i].time;
      for (let j = 1; j < numberOfSeries; j++) {
        if (time != undefined && time >= 0) {
          delete series[j][time];
        }
      }
    }

    return dataColumns;
  }

  function isDataPointInEverySeries(time: string) {
    for (let i = 0; i < numberOfSeries; i++) {
      if (!Object.prototype.hasOwnProperty.call(series[i], time)) {
        return false;
      }
    }
    return true;
  }

  function getLoose() {
    const dataColumns = [];

    // maps time:number => column:DataColumn
    // for fast data column creation.
    const timeToColumn: Record<number, DataColumn> = {};

    for (let seriesIndex = 0; seriesIndex < numberOfSeries; seriesIndex++) {
      const eachSeries = series[seriesIndex];
      for (const timeStr in eachSeries) {
        const dataPoint = eachSeries[timeStr];
        if (!dataPoint) {
          continue;
        }

        const time = dataPoint[0];
        let column = timeToColumn[timeStr];

        // This means that it is the first data point of this point in
        // time.
        if (!column) {
          column = timeToColumn[timeStr] = [];
          column.time = time;
          dataColumns.push(column);
        }

        column[seriesIndex] = dataPoint;
      }
    }

    // The logic above does not guarantee data column ordering. The array
    // will mostly be ordered or almost ordered.
    dataColumns.sort(dataColumnSorter);

    // All data points have been processed and can be removed from the queue.
    clear();

    return dataColumns;
  }

  function dataColumnSorter(a: DataColumn, b: DataColumn) {
    return (a.time ?? 0) - (b.time ?? 0);
  }

  function clear() {
    for (let i = 0; i < numberOfSeries; i++) {
      series[i] = {};
    }
  }
}
