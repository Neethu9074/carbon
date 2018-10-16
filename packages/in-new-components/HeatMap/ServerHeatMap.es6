import { compose } from 'recompose';
import React from 'react';

import getLatencyHeatMapOverTime from 'in-subscription/application/getLatencyHeatMapOverTime';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { formatDateTime, formatDate, formatTime } from 'in-services/formatters/date';
import fillMissingBuckets from 'in-new-components/HeatMap/emptyBucketFiller';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import Skeleton from 'in-new-components/Loading/Skeleton';
import HeatMap from 'in-new-components/HeatMap/HeatMap';
import connect from 'in-hoc/connectTo';

import locals from './ServerHeatMap.mless';

export default compose(
  connect(props => ({
    result: getLatencyHeatMapOverTime({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeConfig: props.timeConfig
      },
      maxTimeBuckets: 100,
      maxLatencyBuckets: 20
    })
  }))
)(ServerHeatMap);

function ServerHeatMap(props) {
  const { result } = props;
  let { timeConfig } = props;

  const isLoading = result.progress.loading;
  if (isLoading) {
    return <Skeleton className={locals.skeletonHeatMap} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  timeConfig = getResolvedTimeConfig(timeConfig, result);
  const buckets = fillMissingBuckets(result.data, timeConfig.to - timeConfig.windowSize, timeConfig.to);

  return <HeatMap {...props} timeConfig={timeConfig} data={mapData(buckets)} keys={getKeys(buckets)} />;
}

function mapData(data) {
  if (!data || data.length === 0) {
    return data;
  }

  const mappedData = [];
  const columnWithMaxBuckets = getColumnWithMaxBuckets(data);
  const numMaxRows = columnWithMaxBuckets.latencyBuckets.length;
  const containsDataForMoreThanOneDay = calculateContainsDataForMoreThanOneDay(data);

  for (let iRow = 0; iRow < numMaxRows; iRow++) {
    const firstColumnRow = columnWithMaxBuckets.latencyBuckets[iRow];
    const currentRow = {
      key: String(firstColumnRow.from),
      axisValue: firstColumnRow.from
    };

    for (let iColumn = 0; iColumn < data.length; iColumn++) {
      const column = data[iColumn];
      const dataPoint = column.latencyBuckets[iRow];
      const key = getKeyForColumn(column, containsDataForMoreThanOneDay);
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

  const containsDataForMoreThanOneDay = calculateContainsDataForMoreThanOneDay(data);

  const keys = [];
  for (let iColumn = 0; iColumn < data.length; iColumn++) {
    const column = data[iColumn];
    const key = getKeyForColumn(column, containsDataForMoreThanOneDay);
    keys.push(key);
  }

  return keys;
}

function getKeyForColumn(column, containsDataForMoreThanOneDay) {
  const formatterA = containsDataForMoreThanOneDay ? formatDateTime : formatTime;
  const formatterB = calculateIfTimetampsDifferInDay(column.from, column.to) ? formatDateTime : formatTime;

  return `${formatterA(column.from)} - ${formatterB(column.to)}`;
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

function calculateContainsDataForMoreThanOneDay(data) {
  return calculateIfTimetampsDifferInDay(data[0].from, data[data.length - 1].to);
}

function calculateIfTimetampsDifferInDay(a, b) {
  return formatDate(a) !== formatDate(b);
}
