import { mapProps, compose } from 'recompose';
import { assign } from 'lodash';

import getLatencyHeatMapOverTime from 'in-subscription/application/getLatencyHeatMapOverTime';
import HeatMap from 'in-new-components/HeatMap/HeatMap';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    mappedData: getLatencyHeatMapOverTime({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      },
      maxTimeBuckets: 20,
      maxLatencyBuckets: 10
    }).map(mapData)
  })),
  mapProps(props => {
    const mappedData = props.mappedData;
    if (mappedData) {
      return assign(
        {
          data: mappedData.data,
          keys: mappedData.keys
        },
        props
      );
    }
    return props;
  })
)(HeatMap);

function mapData(result) {
  const data = result.data;
  if (!data || data.length === 0) {
    return data;
  }

  const mappedData = [];
  const numRows = data[0].latencyBuckets.length;

  for (let iRow = 0; iRow < numRows; iRow++) {
    const currentRow = {
      key: `${data[0].latencyBuckets[iRow].from} - ${data[0].latencyBuckets[iRow].to}`
    };

    for (let iColumn = 0; iColumn < data.length; iColumn++) {
      const column = data[iColumn];
      const dataPoint = column.latencyBuckets[iRow];
      const key = `${column.from} - ${column.to}`;
      currentRow[key] = dataPoint.calls;
    }
    mappedData.push(currentRow);
  }

  return {
    data: mappedData.reverse(),
    keys: getKeys(data)
  };
}

function getKeys(data) {
  if (data.length === 0) {
    return data;
  }

  const keys = [];
  for (let iColumn = 0; iColumn < data.length; iColumn++) {
    const column = data[iColumn];
    keys.push(`${column.from} - ${column.to}`);
  }

  return keys;
}
