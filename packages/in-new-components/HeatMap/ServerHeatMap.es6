import { compose } from 'recompose';
import React from 'react';

import getLatencyHeatMapOverTime from 'in-subscription/application/getLatencyHeatMapOverTime';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import { formatTime } from 'in-services/formatters/date';
import HeatMap from 'in-new-components/HeatMap/HeatMap';
import Skeleton from 'in-components/Progress/Skeleton';
import { millis } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

import locals from './ServerHeatMap.mless';

export default compose(
  connect(props => ({
    result: getLatencyHeatMapOverTime({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      },
      maxTimeBuckets: 100,
      maxLatencyBuckets: 20
    })
  }))
)(ServerHeatMap);

function ServerHeatMap(props) {
  const { result } = props;

  const isLoading = result.progress.loading;
  if (isLoading) {
    return <Skeleton className={locals.skeletonHeatMap} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  return <HeatMap {...props} data={mapData(result.data)} keys={getKeys(result.data)} />;
}

function mapData(data) {
  if (!data || data.length === 0) {
    return data;
  }

  const mappedData = [];
  const columnWithMaxBuckets = getColumnWithMaxBuckets(data);
  const numMaxRows = columnWithMaxBuckets.latencyBuckets.length;

  for (let iRow = 0; iRow < numMaxRows; iRow++) {
    const firstColumnRow = columnWithMaxBuckets.latencyBuckets[iRow];
    const currentRow = {
      key: millis.detailed(firstColumnRow.from + (firstColumnRow.to - firstColumnRow.from) / 2)
    };

    for (let iColumn = 0; iColumn < data.length; iColumn++) {
      const column = data[iColumn];
      const dataPoint = column.latencyBuckets[iRow];
      const key = getKeyForColumn(column);
      currentRow[key] = dataPoint ? dataPoint.calls : 0;
    }
    mappedData.push(currentRow);
  }

  return mappedData.reverse();
}

function getKeys(data) {
  if (data.length === 0) {
    return data;
  }

  const keys = [];
  for (let iColumn = 0; iColumn < data.length; iColumn++) {
    const column = data[iColumn];
    const key = getKeyForColumn(column);
    keys.push(key);
  }

  return keys;
}

function getKeyForColumn(column) {
  return formatTime(column.from + (column.to - column.from) / 2);
}

function getColumnWithMaxBuckets(data) {
  let maxNumRows = 0;
  let columnWithMaxBuckets = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i].latencyBuckets.length > maxNumRows) {
      maxNumRows = data[i].latencyBuckets.length;
      columnWithMaxBuckets = data[i];
    }
  }
  return columnWithMaxBuckets;
}
