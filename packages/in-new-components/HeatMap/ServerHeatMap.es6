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
  const numRows = data[0].latencyBuckets.length;

  for (let iRow = 0; iRow < numRows; iRow++) {
    const firstColumnRow = data[0].latencyBuckets[iRow];
    const currentRow = {
      key: millis.compact(firstColumnRow.from + (firstColumnRow.to - firstColumnRow.from) / 2)
    };

    for (let iColumn = 0; iColumn < data.length; iColumn++) {
      const column = data[iColumn];
      const dataPoint = column.latencyBuckets[iRow];
      const key = formatTime(column.from + (column.to - column.from) / 2);
      currentRow[key] = dataPoint.calls;
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
    const key = formatTime(column.from + (column.to - column.from) / 2);
    keys.push(key);
  }

  return keys;
}
